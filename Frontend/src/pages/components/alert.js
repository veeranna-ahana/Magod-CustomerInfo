import React from "react";
import {
  // Container,
  // Row,
  // Col,
  // Form,
  Button,
  // Card,
  Modal,
} from "react-bootstrap";

function AlertModal(props) {
  // const [show, setShow] = useState(props.show);

  return (
    <Modal show={props.show} onHide={props.onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>{props.message}</p>
      </Modal.Body>

      <Modal.Footer>
        <Button
         style={{backgroundColor:"#2b3a55",border:"#2b3a55"}}
          
          onClick={() => {
            props.firstbutton();
          }}
        >
          {props.firstbuttontext}
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            props.secondbutton();
          }}
        >
          {props.secondbuttontext}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AlertModal;
