import { Button } from "react-bootstrap";
import Badge from "react-bootstrap/Badge";
import ListGroup from "react-bootstrap/ListGroup";
import { NavLink } from "react-router-dom";

export default function EventsList({events, getCategories}) {

  return (
    <>
    {events.length !== 0 ? (<ListGroup className="eventsList" as="ul">
        {events.map((event) => {
          // let date = event.date;  
          // const dateTimeInParts = date.split( "T" ); 
          // const day = dateTimeInParts[ 0 ];
          // const time = dateTimeInParts[ 1 ];
          // console.log(`${day} and ${time}`);         
        
          return (
            <NavLink
            to={`/event/${event._id}`} style={{textDecoration: "none"}}
            key={event._id}
            >
               <ListGroup.Item
              as="li"
              className="d-flex justify-content-between align-items-start">
              <div className="ms-2 me-auto">
                <div className="fw-bold">{event.title}</div>
                {event.general_location} || Date || Time || Created by {event.author?.name ? (event.author?.name) : ("unknown")}{" "} 
                || searching for {event.participants ? (event.participants) : ("not specified number of")} people{" "} 
                || Category: {event.category?.name ? (event.category?.name) : ("undefined")}              
              </div>
              <Badge bg="secondary" pill>
                already joined: 2
              </Badge>

            </ListGroup.Item>
            </NavLink>
          );
        })}
      </ListGroup>) : ("No matching events. Please try out with different filters.")}
      
    </>
  );
}