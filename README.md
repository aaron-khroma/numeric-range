# Shopify Numeric Range
Shopify's Online Store 2.0 greatly advances the functionality of their ecommerce systems, by allowing merchants to define types for their custom Metafields. They also added the ability to use these custom Metafields for collection page filtering, giving detailed control to store visitors searching for the perfect product.

## The Problem
Despite the addition of typed Metafields and collection filters, Shopify has not yet enabled theme developers to specify different filter UI elements for different Metafield datatypes. All Metafield filters are defined by the "text" presentation, and are treated as discrete boolean values by the API. This leaves developers with no reliable way besides checkboxes to display these filters... or does it? (VSauce theme plays)

## My Solution
Although Metafield collection filter checkboxes cannot be replaced, they can be controlled by a slider UI element if the Metafield in question is a numeric value. This repository includes pieces of the code that I used to create the [allavino.com](https://allavino.com) Numeric Range collection filter system. This system allows a merchant to define which of their enabled Metafield filters use numeric values. Then when the UI for these filters is then generated, the clunky standard checkboxes are "wrapped" by a custom slider element which allows for intuitive manipulation of their values.

```
{%- render 'numeric-range',
  filter_min_value: filter_min.value,
  filter_max_value: filter_max.value,
  filter_range_min: filter_lowest.value,
  filter_range_max: filter_highest.value,
  filter_inc: numeric_increment,
  filter: filter
%}
```

## Included Code
The code included here is by no means comprehensive, but contains the major parts that a Shopify developer would need to integrate this functionality into a Shopify theme.

- **snippets/numeric-range.liquid**: This is the main markup file for the filter system, a custom element which is rendered using parameters passed in from collection-filters.liquid. Note that it is dependent on the [NoUISlider JS library](https://refreshless.com/nouislider/), which is not included in the repository.
- **snippets/collection-filters.liquid**: This file contains bits of code which are needed to integrate the numeric filter system into a Shopify collection page. These need to be manually merged into an existing collection page per the provided descriptions of their function.
- **assets/collection.js**: Bits of script which handle any changes to the numeric filter, and pass them onto a collection rendering function.
- **assets/numeric-range.js**: The script that runs the filter system. This custom element serves as an interface for hidden checkboxes, implementing the streamlined NoUISliders library to toggle them on and off within a selected range.
- **config/settings_schema.json**: A small portion of a Shopify settings schema file that can be used to add a control panel to the theme customizer.
- **locales/en.default.schema.json**: A small portion of a Shopify translation file that labels the numeric filter control panel.
