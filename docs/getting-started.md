# Getting Started

### 1. Add the plugin to your project

To use the plugin, add it to your project via the following plugin URL:

```
https://penpot.malliaridis.com/manifest.json
```

For more information on how to add plugins, refer to
[penpot plugins - Getting started](https://help.penpot.app/plugins/getting-started/).

### 2. Before you create a theme

Before you create your first theme, you should decide where you want to store
it. Since hundreds of values may be generated, it is recommended to store the
theme assets in a separate file which you then publish and import as a library.

Later, if you want to switch between themes or toggle between the light and dark
theme, you can use the plugin in the file where you use the assets.

You are free to generate assets directly in the file you are working on.
However, bear in mind that the theme builder may override existing values if
you use paths or names that conflict with the ones used by the theme builder.
Therefore, it is safer to add the theme assets always in separate files.

See [Organizing your Project Files](organizing-files.md) for more information.

### 3. Create your first theme

To create your first theme, provide a theme name (defaults to material-theme)
and a source color, and then hit "Generate Theme".

You can also generate tonal palettes or state layer assets, which are simply the
base colors with different opacities. It is recommended not to generate these
values if you do not use them. You can still add them later by updating
the existing theme.

### 4. Updating your theme

To update your theme, you can choose in the "themes" tab the the theme and
adjust the theme properties. This will update all assets currently found for
the theme.

### 5. Additional Tools

There are currently three tools you can use together with the generated assets.
These tools can be found under "Tools" -> Tool.

The first tool is "Restyle Shapes" which allows you to swap the colors from your
current selection or the current page with colors of the same theme.
Right now only switching between light and dark mode colors is supported, as
these are the only two variants the generated themes have.

The second tool is "Change Theme", which allows you to swap the assets from the
first theme with the assets of the second theme (dropdowns). This is useful
if you don't want to modify a theme's values, but would like to see how your
current design would look like with a different theme.

Last tool is the "Replace Theme Values", which allows you to replace the assets
of a local theme with the values of any other theme found. This is useful if
your components spread across multiple files and you are referencing a single
base theme. With the tool you can maintain all available themes and swap the
values of the base theme on demand, updating all components using its assets.

Note that you can only update local themes, so you have to be in the file you
created the theme you want to update.
