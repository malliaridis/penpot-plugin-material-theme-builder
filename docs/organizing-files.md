# Organizing your Project Files

The organization of your project files is crucial for the maintainability of
your project. As this plugin may add hundreds of assets per theme that is
generated, it is recommended to generate and store the assets in one or more
separate files.

Below are two recommended file structures that you may consider following.

## Simplified Project Structure

If you have a single, simple product or app with one theme only, you may have
one file for the theme and components, and one for the actual designs.

### my-app-library.penpot (shared library)

This library file shared in the team would include:

- `my-app-theme` - Generated theme assets
- shared app components, like buttons, input fields and toolbars

When you want to change the theme, you would directly update the theme assets
you have with the plugin. You do not need any plugin tool for doing so.

### my-app.penpot (app project)

The app file that contains the actual product / designs of the app and uses
components from `my-app-library.penpot`.

When you want to change between light and dark themes, you would do it in this
file by selecting the components and using the light / dark theme toggle
feature.

## Advanced Project Structure

For the advanced project structure you may start with the files from the
simplified project structure, and scale to the advanced one once needed.

What you may consider to do different here is to split the components and the
theme assets into two different files, e.g. `my-app-components.penpot` and
`my-app-theme.penpot`. This allows you to import and use the theme independent
from the app's components.

### Additional Files per theme (shared libraries)

Next, you may want to use multiple themes, which you should prefer to store in
separate files for performance reasons. These themes can be generated the same
way as the base theme in the previous files.

When working with multiple themes, you would likely reference one base theme
from your components, and update that theme on demand.

This plugin provides for this reason the "Replace Theme Values" tool, that
would come in handy here. You can update your base theme with one from the
additional libraries by using this tool. Your components and the `my-app.penpot`
do not have to reference these theme files, but only the base theme from
`my-app-theme.penpot`. This way, when working with the assets, you do not get
distracted with irrelevant assets.

### Multiple Product Designs

The above structure is also flexible enough to allow multiple products to be
designed with the same assets. You would likely create different files for each
product and reference the base theme. If needed, you can still reference one
of the additional themes, usually only temporary, and swap the assets to have a
look how the product looks in a different theme.

## Disclaimer

The above proposals are only personal recommendations, and you do not have to
follow them. You should organize your files the way that works best for you.
This plugin and its features were planned based on the above structure, but it
still can work in any other project as well. If you have any alternative
approaches to organizing these assets, feel free to share them with the
community.
