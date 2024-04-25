const onvif = require("node-onvif");
const Stream = require("node-rtsp-stream");

const express = require("express");

const app = express();

const USER = "admin";
const PASS = "admin";
const WSPORT = "9999";

let device = new onvif.OnvifDevice({
  xaddr: "http://192.168.10.3:8090/onvif/device_service",
  user: USER,
  pass: PASS,
});

app.get("/getStream", (req, res) => {
  try {
    device
      .init()
      .then(() => {
        // Get the UDP stream URL
        let url = device.getUdpStreamUrl();
        const authUrl = url.replace(
          "rtsp://",
          "rtsp://" + USER + ":" + PASS + "@"
        );

        // Get the path to the FFmpeg binary from ffmpeg-static

        stream = new Stream({
          name: "name",
          streamUrl: authUrl,
          wsPort: WSPORT,
          ffmpegOptions: {
            "-stats": "", // an option with no necessary value uses a blank string
            "-r": 30, // options with required values specify the value after the key
            // Add the path to the FFmpeg binary
          },
        });

        res.status(200).send({ url: `ws://localhost:${WSPORT}` });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error initializing device");
      });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error initializing device");
  }
});

app.listen(4010, () => {
  console.log(`Example app listening`);
});
