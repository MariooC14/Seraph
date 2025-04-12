# Seraph

Open source ssh manager

# Set up

1. Clone the repository
2. For windows:
   - Install the Visual C++ Build Environment by either installing the Visual Studio Build Tools or the Visual Studio Community Edition. The minimum workload to install is Desktop Development with C++. But there are additional components from "Individual components":
      - MSVC v143 - VS 2022 C++ x64/x86 Spectre-mitigated libs (Latest) (use ARM64 for Windows on ARM, but the x64/x86 may still be needed)
4. Run `npm install`

   Note: You might need to run `npm install --force` if you encounter any errors.

5. Run `npm start`

# Package

For more info on how to package the app, check out the [docs](https://www.electronforge.io/core-concepts/build-lifecycle).

Run `npm run package` to make a build.

You will see the build in the `out` folder.

# Note

The auth section is not implemented yet.
