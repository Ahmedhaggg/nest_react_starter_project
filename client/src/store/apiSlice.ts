import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const apiSlice = createApi({
    reducerPath: "apiSlice",
    baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_API_URL }),
    tagTypes: ["Api", "Student", "Course", "Grade", "UnitRevision", "CourseRevision", "Unit", "Lesson"],
    endpoints: (builder) => ({})
});

