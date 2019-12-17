# Geo-Mapping

## Project Objectives
This project involved the geo-mapping of earthquake data sourced from USGS in relation to the estimated epicenter and magnitude. This is coupled along with the charting of the tectonic plates to show hot spots for earthquake activity.  

#### Project Status: Complete

### Methods
* Geo-Mapping
* Webpage Deployment
* Frontend Development

### Technologies
* JavaScript
* API Interactions
* Leaflet
* HTML
    * CSS

## Project Description

The project involved using earthquake GeoJSON data from the [USGS](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php) to map earthquakes around the globe by their magnitude using [MapBox](https://www.mapbox.com/) API. The marker for each earthquake indicates magnitude by its color and size. Accompanying this, GeoJSON data of the tectonic plates, sourced from [Fraxen Github](https://github.com/fraxen/tectonicplates), was included to show hotspot areas.
This data is mapped with several differing maps to allow users to view the data in altering fashion. Doing this allows certain aspects to become more highlighted or less pronounced so the user can gleam as much information as possible from the data.


## Launching the App Locally
**Note**: Must have GitBash and MonogDB installed and Chrome Driver Path.

1. Clone This Repo to A Local File

2. Add Your API Key to the config file. 

3. Using GitBash in the folder's location using the following to code:
* python -m http.server

4. Next, in your preferred web browser type _127.0.0.1:8000_ into the URL. 
* Wait a couple seconds as the large datasets take time to load.

## Potential Issues
* If the site is load too quickly, it's possible that the larger dataset, _"Monthly Data"_, didn't have time to load and there would not be present.

## Author

| Alex Wolf | https://github.com/AlexMattWolf |

