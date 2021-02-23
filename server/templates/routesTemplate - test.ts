export default (collectionName: string) => 

`[
  {
    "method": "GET",
    "path": "/${collectionName}",
    "handler": "restaurants.find",
  },
  {
    "method": "GET",
    "path": "/${collectionName}/:id",
    "handler": "restaurants.findOne",
  },
  {
    "method": "POST",
    "path": "/${collectionName}",
    "handler": "restaurants.create",
  },
  {
    "method": "PUT",
    "path": "/${collectionName}/:id",
    "handler": "restaurants.update",
  },
  {
    "method": "DELETE",
    "path": "/${collectionName}/:id",
    "handler": "restaurants.delete",
  }
]
`;