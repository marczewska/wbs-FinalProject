import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { useEffect, useContext, useState } from "react";
import axios from "../../api/axios";
import { AuthContext } from "../../context/AuthProvider";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Modal from "react-bootstrap/Modal";
import LoadingSpinner from "../GeneralComponents/LoadingSpinner";

export default function SingleUser() {
  const { user } = useContext(AuthContext);
  //to show and hide the modal
  const [show, setShow] = useState(false);
  //logged in user info
  const [userP, setUserP] = useState({});
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userLocation, setUserLocation] = useState("");
  const [userDescription, setUserDescription] = useState("");
  const [userId, setUserId] = useState("");
  //state for profile image
  const [userFile, setUserFile] = useState(null);

  //state for events of logged in user
  const [events, setEvents] = useState([]);
  //for pagination in events
  const [visible, setVisible] = useState(3);
  const [isLoaded, setIsLoaded] = useState(false);
  //funcation for foramtting date time
  const formatDateTime = (date) => {
    const year = date.getFullYear();
    const day = date.getDate();
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month = months[date.getMonth()];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weekday = days[date.getDay()];
    const formattedDate =
      weekday && day && month && year
        ? `${weekday}, ${day} ${month} ${year}`
        : null;

    // get the time
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const formattedTime = hour && minutes ? `${hour}:${minutes}` : null;
    return [formattedDate, formattedTime];
  };

  useEffect(() => {
    axios.get(`/users/profile`).then((response) => {
      setUserP(response.data);
      setUserId(response.data?._id);
      setUserName(response.data?.name);
      setUserEmail(response.data?.email);
      setUserDescription(response?.data.description);
      setUserLocation(response.data?.location);
      setUserFile(response.data?.profilePic);
      console.log(response.data);
      axios.get(`/events?user=${response.data._id}`).then((response) => {
        setEvents(response.data);
      });
      setIsLoaded(true);
    });
  }, []);
  //object sent in put request
  const userProfile = {
    email: userEmail,
    description: userDescription,
    name: userName,
    location: userLocation,
    profilePic: userFile,
  };

  const submitHandler = (e) => {
    e.preventDefault();
    axios.put(`/users/${userId}`, userProfile).then((response) => {
      setUserP({
        email: response.data?.email,
        description: response.data?.description,
        name: response.data?.name,
        location: response.data?.location,
        profilePic: response.data?.profilePic,
      });
      console.log(response.data);
    });
    setShow(false);
  };

  //methods to hide and show the edit profile modal
  const handleClose = () => {
    setShow(false);
  };

  const handleShow = () => setShow(true);

  //method for pagination on events of the logged in user
  const loadMore = () => {
    setVisible((prev) => prev + 3);
  };

  //method for image upload
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  //method for selecting an image in the edit profile modal
  const uploadImage = async (e) => {
    const base64 = await toBase64(e.target.files[0]);
    setUserFile(base64);
  };

  return (
    <>
      {isLoaded ? (
        <>
          <div className="userProfileDiv">
            <Card id="userDesc">
              <Card.Img variant="top" src={userP.profilePic} />
              <Card.Body>
                <Card.Title className="text-center fw-bold">
                  {userP.name}
                </Card.Title>
                <Card.Text>From: {userP.location}</Card.Text>
                <Card.Text>{userP.description}</Card.Text>
                <div className="d-grid gap-2 d-sm-flex justify-content-sm-center mb-3">
                  <Button
                    className="w-30 mt-3"
                    variant="secondary"
                    onClick={handleShow}
                  >
                    Edit profile
                  </Button>
                </div>
              </Card.Body>
            </Card>

            <Modal className="mt-4" show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Edit your profile</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={submitHandler}>
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Name"
                      name="name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Email"
                      value={userEmail}
                      name="email"
                      onChange={(e) => setUserEmail(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Location</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Location"
                      value={userLocation}
                      name="location"
                      onChange={(e) => setUserLocation(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <FloatingLabel controlId="floatingTextarea2">
                      <Form.Control
                        as="textarea"
                        placeholder="About me"
                        style={{ height: "100px" }}
                        value={userDescription}
                        name="description"
                        onChange={(e) => setUserDescription(e.target.value)}
                      />
                    </FloatingLabel>
                  </Form.Group>
                  <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Upload profile picture</Form.Label>
                    <Form.Control
                      type="file"
                      name="file"
                      // value={userFile}
                      onChange={uploadImage}
                    />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="outline-secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="secondary" onClick={submitHandler}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>

            <Card id="userEvents">
              <Card.Body>
                <Card.Title className="fw-bold mb-4">My activities</Card.Title>


                
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th><b>Event Name</b></th>
                        <th><b>Event Date</b></th>
                        <th><b>Event Time</b></th>
                        <th><b>Event Location</b></th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.slice(0, visible).map((event, index) => {
                        const date = new Date(event.date);
                        let dateTime = formatDateTime(date);
                        return (
                          <tr key={index}>
                            <td>{event.title}</td>
                            <td>{dateTime[0]}</td>
                            <td>{dateTime[1]}</td>
                            <td>{event.general_location}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                  <div className="d-grid gap-2 d-sm-flex justify-content-sm-center mb-3">
                    <Button
                      className="w-30 mt-3"
                      variant="secondary"
                      onClick={loadMore}
                    >
                      Load more
                    </Button>
                  </div>
                

              </Card.Body>
            </Card>
          </div>
        </>
      ) : (
        <LoadingSpinner />
      )}
    </>
  );
}
