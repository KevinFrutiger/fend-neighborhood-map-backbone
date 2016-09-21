# Neighborhood Map project - Backbone

[View the live application](https://kevinfrutiger.github.io/fend-neighborhood-map-backbone/)

This project was a rebuild of a [Knockout version of an application](https://github.com/KevinFrutiger/frontend-nanodegree-neighborhood-map) featuring a Google Map and a filtered list of places.

## Running the Application

You can run the application [here](https://kevinfrutiger.github.io/fend-neighborhood-map-backbone/).

Alternatively, you can run the files locally by doing the following:

1. Download the .zip file using the **Clone or download** button above (or clone the repository).
2. Unzip the file
3. To run the application, you must run the files through a web server. [http-server](https://www.npmjs.com/package/http-server) is a simple local server you can get via npm.
4. Point your browser to **index.html** in the **src** folder of the files that you just unzipped to run the non-minified files. Point your browser to **index.html** in the **dist** folder to run the same files found on the live site.

## Using the Application

When the application loads, you'll see a Google Map with markers designating some pre-defined locations. You can click these markers to get additional information.

### Filtering the map results

On the left side of the application is the filter menu. On smaller screens it's hidden behind the menu icon. Simply click/tap the icon to display the filter. The map displays markers for the places listed in this menu. You can filter the locations shown by entering text in the input field, and the list and markers will only display for those place names that match the text you've entered.

## Known Issues

- When viewing in landscape on iPhone with multiple documents open, the header can sometimes end up under the tab interface, making the filter menu inaccessible. This can be resolved by closing other documents or refreshing the page.
- The background of the filtered list's last item bleeds past the rounded corners of its container when selected. This was done to resolve an issue found during testing with Safari dropping the focus outline on that item when overflow:hidden is used on the parent container. I felt having a focus outline was more important to have until such time as I fix the overall problem.