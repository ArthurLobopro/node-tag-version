const path = require("path")
const fs = require("fs")
const { execSync } = require("child_process")

const rootDir = process.env.INPUT_ROOT
const isTest = process.env.INPUT_TEST === "true"

function getPackage() {
    try {
        const packagePath = path.resolve(rootDir, "package.json")
        const packageContent = fs.readFileSync(packagePath)

        if (!packageContent) {
            throw new Error("No package.json content")
        }

        return JSON.parse(packageContent)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

const { version } = getPackage()

if (isTest) {
    console.log(version)
    process.exit(0)
}

if (!isTest) {
    execSync(`git tag v${version}`)
    execSync(`git push origin --tags`)
    process.exit(0)
}