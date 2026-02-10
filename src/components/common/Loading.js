import { Container, Spinner } from "react-bootstrap";

const Loading = ({ message = "로딩 중..." }) => {
  return (
    <Container
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ minHeight: "50vh" }}
    >
      <Spinner
        animation="border"
        role="status"
        style={{ color: "#22C55E", width: "3rem", height: "3rem" }}
      />
      <p className="mt-3 text-secondary">{message}</p>
    </Container>
  );
};

export default Loading;
