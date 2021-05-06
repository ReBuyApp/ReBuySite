import React, { Component } from "react";
import api from "../../../API/API";
import GoogleMapReact from "google-map-react";
import Marker from "./Marker";
import Geocode from "react-geocode";
import Search from "../Home/Search";
import PopUp from "../../Utils/PopUp";

export default class GoogleMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      images: [],
      users: [],
      product: null,
      locations: [{}],
      selected: "tel-aviv",
      center: {
        lat: 31.96996095111596,
        lng: 34.77278720495645,
      },
      zoom: 10,
      isModelOpen: false,
      setLoading: this.props.setLoading,
    };
    this.state.setLoading(true);
  }

  componentDidMount = async () => {
    this.state.setLoading(false);

    Geocode.setApiKey("AIzaSyDzTw-IhXNRYDH1QpvVVNp_ix9AzFC0McM");
    Geocode.setLanguage("He");
    Geocode.setRegion("Il");
    Geocode.setLocationType("ROOFTOP");
    Geocode.enableDebug();

    try {
      await api.getAllProducts().then((product) => {
        this.setState({
          products: product.data.data,
        });
        this.state.products.map(
          (p, i) =>
            p["address"] &&
            Geocode.fromAddress(p["address"]).then(
              // Geocode.fromAddress("RISHON-LE-ZION").then(
              (response) => {
                var { lat, lng } = response.results[0].geometry.location;
                // lat = lat + i * 0.005;
                // lng = lng + i * 0.005;
                lat = lat;
                lng = lng;
                this.setState({
                  locations: this.state.locations.concat([
                    { id: p._id, lat: lat, lng: lng },
                  ]),
                });
                // console.log(this.state.locations);
              },
              (error) => {
                console.error(error);
              }
            )
        );
        this.setState((state) => {
          const [first, ...rest] = state.locations;
          return {
            locations: rest,
          };
        });
      });
      await api.getAllImages().then((image) => {
        this.setState({
          images: image.data.data,
        });
      });
      await api.getAllUsers().then((user) => {
        this.setState({
          users: user.data.data,
        });
      });
      this.state.setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  searchHandler = (products) => {
    this.setState({
      products,
    });
  };
  productHandler = (product) => {
    this.setState({
      product,
      selected: product["address"],
    });
  };
  modalHandler = (isModelOpen) => {
    this.setState({
      isModelOpen,
    });
  };
  render() {
    const {
      products,
      images,
      users,
      center,
      zoom,
      isModelOpen,
      product,
      locations,
      selected,
    } = this.state;

    const apiIsLoaded = (map, maps) => {
      if (map) {
        const directionsService = new maps.DirectionsService();
        const directionsDisplay = new maps.DirectionsRenderer();
        directionsDisplay.setMap(map);

        let infoWindow = new maps.InfoWindow();
        const locationButton = document.createElement("button");
        locationButton.textContent = "Pan to Current Location";
        locationButton.classList.add("custom-map-control-button");
        map.controls[maps.ControlPosition.TOP_CENTER].push(locationButton);
        locationButton.addEventListener("click", () => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const pos = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                };
                directionsService.route(
                  {
                    origin: pos,
                    destination: product ? product["address"] : "Tel-Aviv",
                    travelMode: maps.TravelMode.DRIVING,
                  },
                  (response, status) => {
                    if (status === "OK") {
                      directionsDisplay.setDirections(response);

                      console.log(response.routes[0]);
                    } else {
                      console.log(status);
                      // window.alert("Directions request failed due to " + status);
                    }
                  }
                );
                infoWindow.setPosition(pos);
                var marker = new maps.Marker({
                  position: pos,
                  map: map,
                  title: "",
                  icon:
                    "https://maps.google.com/mapfiles/kml/shapes/info-i_maps.png",
                });

                infoWindow.setContent(
                  <img
                    src="https://maps.google.com/mapfiles/kml/shapes/info-i_maps.png"
                    alt="place"
                  />
                );
                infoWindow.open(map);
                map.setCenter(pos);
              },
              () => {
                handleLocationError(true, infoWindow, map.getCenter());
              }
            );
          } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
          }
        });
      }
      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(
          browserHasGeolocation
            ? "Error: The Geolocation service failed."
            : "Error: Your browser doesn't support geolocation."
        );
        infoWindow.open(map);
      }
    };

    function getMapOptions(maps) {
      return {
        streetViewControl: true,
        scaleControl: true,
        fullscreenControl: true,
        styles: [
          {
            featureType: "poi.business",
            elementType: "labels",
            stylers: [
              {
                visibility: "off",
              },
            ],
          },
        ],
        gestureHandling: "greedy",
        disableDoubleClickZoom: true,
        minZoom: 0,
        maxZoom: 30,
        layerTypes: ["TrafficLayer"],
        mapTypeControl: true,
        mapTypeId: maps.MapTypeId.ROADMAP,
        mapTypeControlOptions: {
          style: maps.MapTypeControlStyle.DROPDOWN_MENU,
          position: maps.ControlPosition.RIGHT_CENTER,
          mapTypeIds: [
            maps.MapTypeId.ROADMAP,
            maps.MapTypeId.SATELLITE,
            maps.MapTypeId.HYBRID,
          ],
        },
        zoomControl: true,
        clickableIcons: false,
        getCurrentPosition: true,
      };
    }

    return (
      <>
        <div
          style={{
            position: "absolute",
            top: "3rem",
            alignItems: "center",
            width: "min-content",
            padding: "2rem",
            zIndex: "99",
          }}
        >
          <Search
            searchHandler={this.searchHandler}
            style={{ position: "absolute" }}
          />
        </div>
        <div style={{ height: "97.2vh", width: "100%" }}>
          <GoogleMapReact
            bootstrapURLKeys={{
              key: "AIzaSyAiTqUoIPktHrM66nIC7fRevgXvj7BzN-A",
              language: "he",
              region: "il",
            }}
            defaultCenter={center}
            defaultZoom={zoom}
            options={getMapOptions}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map, maps }) => apiIsLoaded(map, maps)}
          >
            <PopUp
              product={product}
              images={images}
              users={users}
              isModelOpen={isModelOpen}
              setIsModelOpen={this.modalHandler}
            />
            {products.map((product, i) => {
              return (
                <Marker
                  lat={
                    locations.some((i) => i.id === product._id)
                      ? locations.find((i) => i.id === product._id).lat
                      : null
                  }
                  lng={
                    locations.some((i) => i.id === product._id)
                      ? locations.find((i) => i.id === product._id).lng
                      : null
                  }
                  product={product}
                  images={images}
                  users={users}
                  key={product._id}
                  setIsModelOpen={this.modalHandler}
                  setData={this.productHandler}
                />
              );
            })}
          </GoogleMapReact>
        </div>
      </>
    );
  }
}
