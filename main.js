const path = require("path")
const fs = require("fs")
const { execSync } = require("child_process")

const rootDir = process.env.INPUT_ROOT
const isTest = process.env.INPUT_TEST === "true"


const exitCode = main()
process.exit(exitCode)


function main() {
    try {
        const { version } = getPackage()

        if (!version) {
            throw new Error("No version provided in package.json")
        }

        if (isTest) {
            console.log(version)
            return 0
        }

        const currentTags = execSync("git tag -l").toString().split("\n")

        const tagName = `v${version}`

        if (currentTags.includes(tagName)) {
            console.log(`Current tag "${tagName}" already exists.`)
            console.log("Aborting......")
            return 0
        }

        if (!isTest) {
            execSync(`git tag ${tagName}`)
            execSync(`git push origin --tags`)
            return 0
        }
    } catch (error) {
        console.error(error)
        return 1
    }
}

function getPackage() {
    const packagePath = path.resolve(rootDir, "package.json")
    const packageContent = fs.readFileSync(packagePath)

    if (!packageContent) {
        throw new Error("No package.json content")
    }

    return JSON.parse(packageContent)
}