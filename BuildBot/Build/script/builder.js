const { build, Platform, Arch } = require('electron-builder');
const fs = require('fs');

/**
 * @param {String} key 
 * @returns {Promise} Path to builded file
 */
module.exports = async function Build(key) {
    return new Promise(async(resolve, reject) => {
        await build({
            targets: Platform.WINDOWS.createTarget(null, Arch.x64),
            config: {
                appId: 'Installer',
                productName: 'Installer',
                win: {
                    artifactName: `Sudry_${key}.exe`,
                    target: 'portable'
                },
                compression: 'normal',
                buildVersion: '1.0.0',
                electronVersion: '17.1.0',
                nodeGypRebuild: false,
                npmRebuild: false,
                directories: {
                    app: `./Build/script/${key}`,
                    output: `./Build/dist/${key}`
                }
            }
        })
        .then(() => {
            fs.unlinkSync(`./Build/dist/${key}/builder-debug.yml`);
            fs.unlinkSync(`./Build/dist/${key}/builder-effective-config.yaml`);
            fs.rmSync(`./Build/dist/${key}/win-unpacked`, { recursive: true });
            fs.rmSync(`./Build/script/${key}`, { recursive: true });
            return resolve();
        })
        .catch((err) => {
            console.log(err)
            return resolve('Error');
        });
    });
};