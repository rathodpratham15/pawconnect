// Send a success response (200 by default) with the provided data
export const setSuccess = (data, response, status = 200) => {
    response.status(status).json(data);
};

// Send an error response with a status derived from the error type
export const setError = (error, response) => {
    console.error("Error:", error);

    let statusCode = error.status || 500;
    let message = error.message || "An unexpected error occurred";

    if (error.name === 'ValidationError') {
        statusCode = 400; // Bad request for validation errors
    } else if (error.code === '22P02') {
        statusCode = 400; // Postgres: malformed value (e.g. an invalid UUID)
        message = "Invalid identifier or value provided";
    } else if (error.code === '23505') {
        statusCode = 409; // Postgres: unique violation (e.g. email already registered)
        message = "A record with these details already exists";
    } else if (error.code === '23503' || error.code === '23514') {
        statusCode = 400; // Postgres: foreign key / check constraint violation
        message = "The data conflicts with an existing record or an allowed value";
    } else if (statusCode === 500 && typeof error.code === 'string' && /^[0-9A-Z]{5}$/.test(error.code)) {
        message = "Database error, please try again later"; // any other Postgres error
    }

    const body = { message };
    if (process.env.NODE_ENV !== "production") {
        body.stack = error.stack;
    }
    response.status(statusCode).json(body);
};
