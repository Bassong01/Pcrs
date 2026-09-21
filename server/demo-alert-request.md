# Demo alert payload example

Use this example to send a real wanted alert with person details, photo URL, and destination region/station.

## Endpoint

POST /api/alerts

Headers:

Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

## Example body

```json
{
  "person_id": 1,
  "case_id": 1,
  "reason": "Wanted for armed robbery and escape from custody.",
  "priority": "high",
  "description": "Suspect is armed and considered highly dangerous. Last seen near the central district.",
  "last_known_loc": "Mokolo Quarter, Yaoundé",
  "region": "Centre",
  "station": "Yaoundé Central Station",
  "photo_url": "http://localhost:5000/uploads/persons/1720000000000-sample.jpg"
}
```

## Photo upload example

POST /api/persons/1/photo

Form-data:

- photo: <image file>

## Notes

- The alert broadcast carries the person identity and photo URL.
- Region and station routing lets the alert reach regional and checkpoint listeners.
- The backend also sends the alert to role-based recipients such as police officers and judicial authority users.
