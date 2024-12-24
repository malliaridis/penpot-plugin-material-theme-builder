# Organizing your Project Files

The organization of your project files is crucial for the maintainability of
your project. As this plugin adds hundreds of assets per theme that is
generated, it is recommended to store various information in separate files.

Below are two recommended file structures that you may consider following.

## Simplified Project Structure

If you have a single, simple product or app with one theme only, you may have
one file for the theme and components, and one for the actual product / app.

### my-app-library.penpot (shared library)

This library file shared in the team would include:

- `my-app-theme` - Generated theme assets
- shared app components, like buttons, input fields and toolbars

When you want to change the theme, you would directly update the theme assets
you have with the plugin, and not use the swap feature.

### my-app.penpot (app project)

The app file that contains the actual product / designs of the app and uses
components from `my-app-library.penpot`.

When you want to change between light and dark themes, you would do it in this
file by selecting the components and using the light / dark theme toggle
feature.

## Advanced Project Structure

The advanced project structure allows you to define multiple themes and swap
them on-the-fly. Note that if you have multiple products with different themes
or components, you should still separate them in different files.

If the products use the same theme and components, and you would like to update
all products when making theme changes, this structure would support that.

### my-app-theme.penpot (shared library)

Library file that contains multiple theme assets, including:

- `my-app-theme` - Generated default app theme that is referenced by the
  components and swapped with one of the below themes
- `my-app-theme-blue` - A variant of the app theme with a blue source color
- `my-app-theme-green` - A variant of the app theme with a green source color
- `my-app-theme-app-icon` - A variant of the app theme with a source color
  generated from the app's icon

Note that all variants are generated the same way as the default theme and are
independent of each other. This allows you to use them as you please without
having specific constraints to the default theme assets.

The theme variants are optional, and you may stick with a single theme that you
update directly whenever you want, similar to the simplified project structure.
By using multiple themes, this library file would "define" the available themes
and provide a "default" theme that is referenced from outside.

When you want to update the theme in your app(s), you would swap the values of
`my-app-theme` with the values of one of the variants. This is where you would
use the swap feature of the plugin.

### my-app-components.penpot (shared library)

Library file that contains app components, like buttons and input fields, and
use `my-app-theme` (default) values from the library `my-app-theme.penpot`.

These components are shared with all app(s) that should the same look-and-feel.

### my-app.penpot (app project)

The app file that uses components from `my-app-components.penpot` and represents
the actual product / app. You may have multiple apps similar to this file.

### Additional Files

Additional files in the project, like `my-app-ideas.penpot`, could store
concepts and ideas that are not yet part of the actual product.
