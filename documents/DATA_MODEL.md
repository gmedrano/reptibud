# Data Model (v0.1)

All data is stored as JSON files per pet.

## Pet Structure

{
  "id": "uuid",
  "name": "Kophii",
  "species": "Ball Python",
  "photoUrl": "/uploads/kophii.jpg",
  "createdAt": "ISO_DATE",
  "updatedAt": "ISO_DATE",
  "logs": []
}

## Log Entry Structure

{
  "id": "uuid",
  "type": "feeding | shedding | note",
  "content": "Ate one mouse",
  "timestamp": "ISO_DATE"
}

## File Layout

/user-data/
  /{user-id}/
    /pets/
      {pet-id}.json

## Notes
- Logs are embedded inside the pet JSON
- Order of logs is chronological
- Structure should not change without migration plan