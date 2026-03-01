# Events Backend Pipeline

## Run

1. Install dependencies:
   - `npm install`
2. Set admin token:
   - `export ADMIN_TOKEN="your-secure-token"`
3. Start server:
   - `npm start`

Public site: `http://localhost:3000`

## API

- Public list:
  - `GET /api/events`
- Create (admin):
  - `POST /api/events`
- Update (admin):
  - `PUT /api/events/:id`
- Delete (admin):
  - `DELETE /api/events/:id`

Admin endpoints require header:
- `x-admin-token: <your-secure-token>`

## cURL Examples

Create event:

```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -H "x-admin-token: $ADMIN_TOKEN" \
  -d '{
    "title":"Evening Bhajan",
    "date":"Mar 10",
    "day":"Tuesday",
    "time":"7:00 PM - 8:30 PM",
    "description":"Community bhajan and kirtan evening."
  }'
```

Update event:

```bash
curl -X PUT http://localhost:3000/api/events/1 \
  -H "Content-Type: application/json" \
  -H "x-admin-token: $ADMIN_TOKEN" \
  -d '{
    "title":"Full Moon Meditation",
    "date":"Mar 14",
    "day":"Friday",
    "time":"7:30 PM - 9:00 PM",
    "description":"Updated schedule with extended guided meditation."
  }'
```

Delete event:

```bash
curl -X DELETE http://localhost:3000/api/events/1 \
  -H "x-admin-token: $ADMIN_TOKEN"
```
