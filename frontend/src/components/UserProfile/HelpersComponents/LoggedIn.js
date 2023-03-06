import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/esm/Button";


export default function LoggedIn() {
  const navigate = useNavigate();
  const [remainingTime, setRemainingTime] = useState(3);


  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (remainingTime === 0) {
      navigate('/users/profile');
    }
  }, [navigate, remainingTime]);

  return (
    <div id="construction" className="text-center">
      <h4 className="display-8 fw-bold">
        You've successfully logged in!
      </h4>
      <p>You'll be redirected to your user profile in {remainingTime} seconds...</p>
      <div className="col-lg-8 mx-auto">
        <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
          <Button
            variant="secondary"
            onClick={() => {
              navigate("/users/profile");
            }}
          >
            Go to your user profile
          </Button>
        </div>
      </div>
    </div>
  );
}
