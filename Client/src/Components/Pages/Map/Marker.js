import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  Typography,
  Button,
} from "@material-ui/core";
import reBuy from "../../../Assets/Images/ReBuyLogoBig.png";
import Modal from "react-modal";
import { IoPinOutline } from "react-icons/io5";
import Carousel from "react-bootstrap/Carousel";
import PopUp from "../../Utils/PopUp";

export default function Marker({ product, images, $hover }) {
  const [isModelOpen, setIsModelOpen] = useState(false);
  return (
    <div>
      <PopUp
        product={product}
        images={images}
        isModelOpen={isModelOpen}
        setIsModelOpen={setIsModelOpen}
      />
      <Button size="small" onClick={() => setIsModelOpen(true)}>
        {product["images"] && images ? (
          <Carousel>
            {images.map(
              (Image) =>
                product["images"].some((id) => id === Image._id) && (
                  <Carousel.Item>
                    <img
                      className={"circleImg"}
                      style={{ width: "3rem", height: "3rem" }}
                      src={`data:${Image["contentType"]};base64,${Image["imageBase64"]}`}
                      alt={Image["fileName"]}
                    />
                  </Carousel.Item>
                )
            )}
          </Carousel>
        ) : (
          <img src={reBuy} alt="marker" className={"circleImg"} />
        )}
      </Button>
    </div>
  );
}
