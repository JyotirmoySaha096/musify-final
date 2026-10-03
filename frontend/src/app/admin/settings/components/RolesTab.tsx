import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/api';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  CircularProgress, Box, Alert, Paper, Typography
} from '@mui/material';

export function RolesTab({ token }: { token: string }) {
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const data = await adminApi.getRoles(token);
      setRoles(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch roles');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Box p={4} display="flex" justifyContent="center"><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" paragraph>
        These are the available roles in the system. Permission management will be added in a future update.
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Role Name</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map(role => (
              <TableRow key={role.id}>
                <TableCell><strong>{role.name}</strong></TableCell>
                <TableCell>{role.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
