function readPackage(pkg, context) {
    if (pkg.name.startsWith('@tamagui/') || pkg.name === "tamagui") {
        const deps = Object.entries(pkg.dependencies);
        pkg.peerDependencies = {...pkg.peerDependencies ?? {}, ...Object.fromEntries(deps.filter(i => i[0].startsWith('@tamagui/')))};
        pkg.dependencies = Object.fromEntries(deps.filter(i => !i[0].startsWith('@tamagui/')));

        if(pkg.dependencies["@tamagui/core"] && pkg.name !== "tamagui") {
            pkg.dependencies["@tamagui/core"] = "workspace:@cz3/app_ui@*";
        }

        if(pkg.dependencies["react"]) {
            pkg.dependencies["react"] = "17.0.2";
            pkg.dependencies["react-dom"] = "17.0.2";
            pkg.dependencies["react-native"] = "0.68.2";
        }
    }

    return pkg
}

module.exports = {
    hooks: {
        readPackage
    }
}

