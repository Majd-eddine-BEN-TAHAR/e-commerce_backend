const router = require("express").Router();

router.post("/contact-us", (req, res) => {
  res
    .status(201)
    .json({ status: 201, message: "we will contact you as soon as possible" });
});

router.post("/report", (req, res) => {
  res
    .status(201)
    .json({ status: 201, message: "we will contact you as soon as possible" });
});

router.post("/newsletter", (req, res) => {
  res
    .status(201)
    .json({
      status: 201,
      message: "Thanks for the subscription to our newsletter!!!",
    });
});

module.exports = router;
