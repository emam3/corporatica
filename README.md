# corporatica

This is a repo for a frontend and a backend project for some data analysis, and it get applied on images, csv, and text files only


### Used tools :
Frontend : React, TypeScript, MUI, Redux and ChartJS

Backend: Python, Flask and sqlite
## API Reference

#### text analysis

```http
  POST /api/text-process
```

| Payload | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `file` | `textFile` | **Required**. |
| `services` | `string[]` | **Required**. |

services for text are : classification, keywords, summarization and T SNE.



#### Image analysis

```http
  POST /api/text-process
```

| Payload | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `file` | `png, jpg, jpeg` | **Required**. |


#### Image analysis

```http
  POST /api/analyze-tabular
```

| Payload | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `file` | `csv` | **Required**. |




```http
  POST /api/analyze-tabular
```

| Payload | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `file` | `csv` | **Required**. |



not implemented in frontend
```http
  POST /api/get-histogram
```

| Payload | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `filename` | `string` | **Required**. |

## Run Locally

## Backend


Clone the project


```bash
  cd corporatica/backend
```

```bash
1- docker build => docker build .
```

```bash
2- docker images
```

```bash
3- docker tag <image_id> analysis_2:latest
```

```bash
4- docker run -p 8080:8080 analysis_2:latest
```

at this point, the backend is running, Let's move to the frontend

go one step back
```bash
1- cd ../
```

```bash
2- cd frontend
```


```bash
3- npm install
```

Start the server
```bash
4- npm run dev
```