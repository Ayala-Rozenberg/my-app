import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { TextField, Button, CircularProgress, Container, Alert } from '@mui/material';
import Map from './Map';


const ZipCodeForm = () => {
    const { control, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            zipCode: ''
        }
    });

    const [geoJsonData, setGeoJsonData] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchBoundaryData = async (zipCode) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(
                `https://vanitysoft-boundaries-io-v1.p.rapidapi.com/reaperfire/rest/v1/public/boundary?zipcode=${zipCode}`,
                {
                    headers: {
                        'x-rapidapi-host':  'vanitysoft-boundaries-io-v1.p.rapidapi.com',
                        'x-rapidapi-key': 'b5703cf0b0msh829889ffda30a92p1a3f2fjsnd5dfed5edf01'
                    },
                }
            );
            if (response?.data?.features[0]) {
                setGeoJsonData(response.data);
                // Update the query string in the URL
                window.history.pushState({}, '', `?zipcode=${zipCode}`);
            } else {
                setError('There are no results for this zip code.');
            }
        } catch (err) {
            setError('Failed to fetch data. Please check the zip code and try again.');
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = (data) => {
        fetchBoundaryData(data.zipCode);
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const zipcodeFromURL = params.get('zipcode');
        if (zipcodeFromURL) {
            setValue('zipCode', zipcodeFromURL);
            fetchBoundaryData(zipcodeFromURL);
        }
    }, [setValue]);

    return (
        <Container>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name="zipCode"
                    control={control}
                    rules={{
                        required: 'Zip code is required',
                        pattern: {
                            value: /^\d{5}(-\d{4})?$/,
                            message: 'Invalid ZIP code format'
                        }
                    }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Zip code"
                            variant="outlined"
                            fullWidth
                            error={!!errors.zipCode}
                            helperText={errors.zipCode ? errors.zipCode.message : ''}
                            style={{ marginRight: '10px' }}
                        />
                    )}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                >
                    Submit
                </Button>
                {loading && <CircularProgress style={{ marginLeft: '16px' }} />}
                {error && <Alert severity="error" style={{ marginTop: '16px' }}>{error}</Alert>}
            </form>
            <Map geoJsonData={geoJsonData} />
        </Container>
    );
};

export default ZipCodeForm;
