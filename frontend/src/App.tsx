import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, TextField, Button, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { backend } from 'declarations/backend';

type TaxPayer = {
  tid: string;
  firstName: string;
  lastName: string;
  address: string;
};

function App() {
  const [taxPayers, setTaxPayers] = useState<TaxPayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTid, setSearchTid] = useState('');
  const { control, handleSubmit, reset } = useForm<TaxPayer>();

  useEffect(() => {
    fetchTaxPayers();
  }, []);

  const fetchTaxPayers = async () => {
    setLoading(true);
    try {
      const result = await backend.getTaxPayers();
      setTaxPayers(result);
    } catch (error) {
      console.error('Error fetching tax payers:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: TaxPayer) => {
    setLoading(true);
    try {
      await backend.addTaxPayer(data.tid, data.firstName, data.lastName, data.address);
      reset();
      await fetchTaxPayers();
    } catch (error) {
      console.error('Error adding tax payer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTid) return;
    setLoading(true);
    try {
      const result = await backend.searchTaxPayer(searchTid);
      if (result) {
        setTaxPayers([result]);
      } else {
        setTaxPayers([]);
      }
    } catch (error) {
      console.error('Error searching tax payer:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          TaxPayer Management System
        </Typography>
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>TID</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Address</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {taxPayers.map((taxPayer) => (
                <TableRow key={taxPayer.tid}>
                  <TableCell>{taxPayer.tid}</TableCell>
                  <TableCell>{taxPayer.firstName}</TableCell>
                  <TableCell>{taxPayer.lastName}</TableCell>
                  <TableCell>{taxPayer.address}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {loading && <CircularProgress />}
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Add New TaxPayer
          </Typography>
          <Controller
            name="tid"
            control={control}
            defaultValue=""
            rules={{ required: 'TID is required' }}
            render={({ field }) => <TextField {...field} label="TID" fullWidth margin="normal" />}
          />
          <Controller
            name="firstName"
            control={control}
            defaultValue=""
            rules={{ required: 'First Name is required' }}
            render={({ field }) => <TextField {...field} label="First Name" fullWidth margin="normal" />}
          />
          <Controller
            name="lastName"
            control={control}
            defaultValue=""
            rules={{ required: 'Last Name is required' }}
            render={({ field }) => <TextField {...field} label="Last Name" fullWidth margin="normal" />}
          />
          <Controller
            name="address"
            control={control}
            defaultValue=""
            rules={{ required: 'Address is required' }}
            render={({ field }) => <TextField {...field} label="Address" fullWidth margin="normal" />}
          />
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Add TaxPayer'}
          </Button>
        </Box>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Search TaxPayer
          </Typography>
          <TextField
            label="Search by TID"
            value={searchTid}
            onChange={(e) => setSearchTid(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button onClick={handleSearch} variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Search'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default App;
