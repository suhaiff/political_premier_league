from fastapi.testclient import TestClient


def test_health_endpoint_returns_structured_response(client: TestClient) -> None:
    response = client.get("/api/v1/health")

    assert response.status_code == 200
    assert response.json() == {
        "applicationName": "Political Premier League API",
        "status": "healthy",
        "apiVersion": "v1",
    }


def test_root_endpoint_returns_application_status(client: TestClient) -> None:
    response = client.get("/")

    assert response.status_code == 200
    assert response.json() == {
        "applicationName": "Political Premier League API",
        "status": "running",
        "apiVersion": "v1",
    }
