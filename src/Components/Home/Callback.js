import React, { useState } from "react";
import { Box, Button, Modal, TextField } from "@mui/material";
import { FaPhone, FaWhatsapp } from "react-icons/fa";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
const Callback = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [compnanyName, setCompnanyName] = useState("");
  const [phone, setPhone] = useState();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handlePhone = (value) => {
    setPhone(value);
  };
  const handleSubmitContact = async () => {
    try {
      const data = {
        name: name,
        companyName: compnanyName,
        phoneNumber: "+" + phone,
      };
      console.log(data);

      const response = await fetch(
        "https://tripbizzapi-lxyskuwaba-uc.a.run.app/sendContactEmail",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      // console.log(response.json());
      const res = response.json();
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    "@media (max-width: 600px)": {
      width: "95%",
      height: "auto",
    },
  };
  return (
    <div className="flex flex-wrap gap-6 justify-center p-8">
      <button
        className="flex gap-2 justify-center items-center bg-[#94d2bd] font-semibold rounded-md p-2 w-[250px]"
        onClick={handleOpen}
      >
        <FaPhone />
        <p className="text-[13px] md:text-[16px]">Request callback</p>
      </button>
      <button
        className="flex gap-2 justify-center items-center bg-[#94d2bd] font-semibold rounded-md p-2 w-[250px]"
        onClick={() => {
          console.log("Clicke");
          const phoneNumber = "8897851321";
          const whatsappUrl = `https://wa.me/+91${phoneNumber}`;
          window.open(whatsappUrl, "_blank");
        }}
      >
        <FaWhatsapp size={25} color="green" />
        <p className="text-[13px] md:text-[16px]">Chat with us</p>
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="border-none focus:outline-none"
      >
        <Box sx={style} className="rounded-lg h-[300px]">
          <h1 className="font-bold text-center pb-4">
            Fill the form our team will get back to You
          </h1>
          <form className="flex flex-col gap-3">
            <TextField
              placeholder="Enter your name"
              size="small"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
            <TextField
              placeholder="Company name"
              size="small"
              onChange={(e) => setCompnanyName(e.target.value)}
              value={compnanyName}
            />
            <PhoneInput country={"in"} onChange={handlePhone} value={phone} />
            <Button
              variant="contained"
              size="small"
              className="w-[100px] m-auto"
              onClick={handleSubmitContact}
            >
              Submit
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default Callback;
