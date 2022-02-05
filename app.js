#!/usr/bin/env node

import { existsSync } from 'fs';
import { promises as fs } from 'fs';
import { normalize, resolve } from 'path';

import { program } from 'commander';

// Get version from package.json
const { version } = JSON.parse(await fs.readFile('package.json'));

// Create the command
program
    .version(version, '-v, --version', 'output the current version')
    .argument('<component-name>')
    .description(
        `creates a '<component-name>.js' file and 'index.js' file in the 'components/<component-name>' sub-directory`
    )
    .option(
        '-m, --module',
        `add a '<component-name>.module.css' file in the '<component-name>' directory`,
        false
    )
    .option(
        '-d, --dir <pathToDirectory>',
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

console.info(`Creating the ${componentName} component!`);
console.info('-'.repeat(75));
console.info('');

// Make sure the parent directory exists
if (!existsSync(resolve(options.dir))) {
    console.error(
        `The directory '${options.dir}' does not exist! Please create it and try again.`
    );
    process.exit(0);
}

// Check if the component already exists
if (existsSync(componentDir)) {
    console.error(
        `There is already a component '${componentDir}' directory! Please delete the directory and try again.`
    );
    process.exit(0);
}

// Create component dir
fs.mkdir(componentDir)
    // Create ${componentName}.js file
    .then(() => {
        console.info(`\tcreated '${componentDir}'`);

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
        console.info(`\tcreated '${componentPath}'`);
        return fs.writeFile(indexPath, indexTemplate);
    })
    // Create ${componentName}.module.css file or skip
    .then(() => {
        console.info(`\tcreated '${indexPath}'`);
        if (options.module) {
            const modulePath = normalize(
                `${componentDir}/${componentName}.module.css`
            );

            return fs.writeFile(modulePath, '').then(() => {
                console.info(`\tcreated '${modulePath}'`);
            });
        }
    })
    .then(() => {
        console.info('');
        console.info('-'.repeat(75));
        console.info(`Yay! Successfully created ${componentName}! :)`);
    })
    .catch((err) => {
        console.error(err);
    });
