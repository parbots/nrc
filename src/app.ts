#!/usr/bin/env node

const version = '2.3.2';

import { existsSync as exists } from 'fs';
import { promises as fs } from 'fs';
import { normalize, resolve } from 'path';

import { program } from 'commander';

import chalk from 'chalk';

const log = (message: string) => {
    console.log(message);
};

// Color info messages as blue
const info = (message: string) => {
    console.info(chalk.blue(message));
};

// Color success messages as green
const success = (msg: string) => {
    log(chalk.green(msg));
};

// Color error messages red
const error = (err: string) => {
    console.error(chalk.red(err));
};

// Create the command
program
    .version(version, '-v, --version', 'output the current version')
    .argument('<component-name>', 'name of the new component')
    .description(
`Creates a functional react component with the following default file structure:

    Example/
        Example.js - Main component file
        index.js - Allows easy importing of component  

The component can the be imported with:
    import example from '/src/components/example'

The default parent directory for components is 'src/components', or 'components' if the previous does not exist

If neither directory exists, nrc will exit without creating the component unless a custom path is passed with the '-d' option
`
    )
    .option(
        '-m, --module',
        `Creates 'component-name.module.css' and adds an import into the main component file`,
        false
    )
    .option(
        '-d, --dir <pathToParentDir>',
        'Specify the path to the parent directory',
        'src/components'
    )
    .option('-t, --typescript', 'Creates .tsx and .ts files instead of .js', false)
    .parse();

// Get the name of the component from the command argument
const [componentName] = program.args;

// Get options from command input
const options = program.opts();

// Removes any excess whitespace or slashes
options.dir = normalize(`./` + options.dir);

// Make sure the parent directory exists
log('');
info('Checking if parent directory exists...');

let fullParentDir = resolve(options.dir);

// Check if 'src/components' or custom directory exists
if (exists(fullParentDir)) {
    success(`'${options.dir}' exists!`);
}
// check 'components' directory if 'src/components' was not found
else if (options.dir == 'src/components') {
    log(`'src/components' not found, checking for 'components'...`);

    fullParentDir = resolve('./components');

    if (exists(fullParentDir)) {
        options.dir = normalize('./components');

        success(`'${options.dir}' exists!`);
    } else {
        error(
            `Could not find a 'src/components' or 'components' directory!\nPlease create one and try again, or specify another directory with '-d <directory-name>'.`
        );

        process.exit(0);
    }
} else {
    error(
        `The directory '${fullParentDir}' does not exist! Please create it and try again.`
    );

    process.exit(0);
}

// The directory of the component (Default: src/components/${componentName})
const componentDir = normalize(`${options.dir}/${componentName}`);

// Component file path
const componentPath = normalize(
    `${componentDir}/${componentName}${options.typescript ? '.tsx' : '.js'}`
);

// Component file template
const componentTemplate = `

${options.module ? `import styles from './${componentName}.module.css'` : ''}

export const ${componentName} = () => {
    return (
        <div>
            <h1>${componentName}</h1>
        </div>
    );
};

`;

// 'index.js' file path
const indexPath = normalize(
    `${componentDir}/index${options.typescript ? '.ts' : '.js'}`
);

// 'index.js' file template
const indexTemplate = `export { ${componentName} } from './${componentName}'`;

// Check if the component already exists
log('');
info('Checking if component already exists...');
if (exists(componentDir)) {
    error(
        `'${componentDir}' already exists! Please delete the directory and try again.`
    );

    process.exit(0);
} else {
    success(`'${componentDir}' does not exist!`);
}

log('');
info(`Creating ${componentName}...`);
// display argument info
if (options.module) {
    info('with module.css');
}
if (options.typescript) {
    info('with typescript');
}
log('-'.repeat(75));
log('');

// Create component dir
fs.mkdir(componentDir)
    // Create ${componentName}.js file
    .then(() => {
        success(`\tcreated '${componentDir}'`);

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
