#!/usr/bin/env node

import { existsSync } from 'fs';
import { promises as fs } from 'fs';
import { normalize, resolve } from 'path';

import { program } from 'commander';

import chalk from 'chalk';

const log = console.log;

const info = (msg) => {
    console.info(chalk.blue(msg));
};

// Color success messages as green
const success = (msg) => {
    console.log(chalk.green(msg));
};

// Color error messages red
const error = (err) => {
    console.error(chalk.red(err));
};

// Get version from package.json
const version = process.env.npm_package_version;

// Create the command
program
    .version(version, '-v, --version', 'output the current version')
    .argument('<component-name>', 'name of the new component')
    .description(
        `creates a new functional component in the 'components/component-name' directory with the following file structure:

    components/example/
        example.js - main component file
        index.js - makes component easier to import

the component can then be imported with:
    import example from '/path/to/components/example'`
    )
    .option(
        '-m, --module',
        `creates and imports 'component-name.module.css' file into component-name.js`,
        false
    )
    .option(
        '-d, --dir <pathToParentDir>',
        'specify the path to the parent directory',
        'components'
    )
    .parse();

// Get the name of the component from the command argument
const [componentName] = program.args;

// Get options from command input
const options = program.opts();

// removes any leading or extra slashes
options.dir = normalize(`./` + options.dir);

// The directory of the component (Default: components/${componentName})
const componentDir = normalize(`${options.dir}/${componentName}`);

// The path of the component file and the file template
const componentPath = normalize(`${componentDir}/${componentName}.js`);
const componentTemplate = `const ${componentName} = () => {
    return (
        <div>
            <h1>${componentName}</h1>
        </div>
    );
};

export default ${componentName};`;

// The path of the index.js file and the file template
const indexPath = normalize(`${componentDir}/index.js`);
const indexTemplate = `export { default } from './${componentName}'`;

// Make sure the parent directory exists
log('');
info('Checking for parent directory...');
const fullParentDir = resolve(options.dir);
if (!existsSync(fullParentDir)) {
    error(
        `The directory '${fullParentDir}' does not exist! Please create it and try again.`
    );
    process.exit(0);
} else {
    success(`'${options.dir}' exists!`);
}

// Check if the component already exists
log('');
info(`Checking for component directory...`);
if (existsSync(componentDir)) {
    error(
        `There is already a '${componentDir}' directory! Please delete the directory and try again.`
    );
    process.exit(0);
} else {
    success(`'${componentDir}' does not exists!`);
}

log('');
log(`Creating the ${componentName} component...`);
if (options.module) {
    info('with module.css');
}
log('-'.repeat(75));
log('');

// Create component dir
fs.mkdir(componentDir)
    // Create ${componentName}.js file
    .then(() => {
        success(`\tcreated '${componentDir}'`);

        // Add import statement if using modules
        if (options.module) {
            const newComponentTemplate =
                `import styles from './${componentName}.module.css'\n\n` +
                componentTemplate;
            return fs.writeFile(componentPath, newComponentTemplate);
        }

        return fs.writeFile(componentPath, componentTemplate);
    })
    // Create index.js file
    .then(() => {
        success(`\tcreated '${componentPath}'`);
        return fs.writeFile(indexPath, indexTemplate);
    })
    // Create ${componentName}.module.css file or skip
    .then(() => {
        success(`\tcreated '${indexPath}'`);
        if (options.module) {
            const modulePath = normalize(
                `${componentDir}/${componentName}.module.css`
            );

            return fs.writeFile(modulePath, '').then(() => {
                success(`\tcreated '${modulePath}'`);
            });
        }
    })
    .then(() => {
        log('');
        log('-'.repeat(75));
        success(`Yay! Successfully created ${componentName}! :)`);
        log('');
    })
    .catch((err) => {
        error(err);
    });
