import {
  Autocomplete,
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { MobileDatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

export default function Index() {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 3,
          marginBottom: 13,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h5" marginBottom={2}>
          New Appointment
        </Typography>
        <Box
          sx={{
            width: "100%",
            marginBottom: 2,
          }}
        >
          <Typography variant="body1">Appointment Time</Typography>
          <Autocomplete
            options={[
              { label: "2023-06-16", value: "2023-06-16" },
              { label: "2023-06-17", value: "2023-06-17" },
              { label: "2023-06-18", value: "2023-06-18" },
              { label: "2023-06-19", value: "2023-06-19" },
              { label: "2023-06-20", value: "2023-06-20" },
            ]}
            renderInput={(params) => (
              <TextField
                variant="filled"
                margin="dense"
                required
                label="Appointment Date"
                name="date"
                {...params}
              />
            )}
          />
          <Autocomplete
            options={[{ label: "09:00 AM", value: "09:00 AM" }]}
            renderInput={(params) => (
              <TextField
                variant="filled"
                margin="dense"
                required
                label="Appointment Time"
                name="time"
                {...params}
              />
            )}
          />
        </Box>
        <Box
          sx={{
            width: "100%",
            marginBottom: 2,
          }}
        >
          <Typography variant="body1">Personal Information</Typography>
          <TextField
            variant="filled"
            margin="dense"
            required
            fullWidth
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            variant="filled"
            margin="dense"
            required
            fullWidth
            label="Phone Number"
            name="phone"
            autoComplete="phone"
            autoFocus
          />
          <TextField
            variant="filled"
            margin="dense"
            required
            fullWidth
            label="First Name"
            name="firstName"
            autoComplete="firstName"
            autoFocus
          />
          <TextField
            variant="filled"
            margin="dense"
            required
            fullWidth
            label="Last Name"
            name="lastName"
            autoComplete="lastName"
            autoFocus
          />
          <MobileDatePicker
            slotProps={{
              textField: {
                variant: "filled",
                margin: "dense",
                required: true,
                fullWidth: true,
                label: "Date Of Birth",
                name: "dob",
                autoComplete: "dob",
                autoFocus: true,
              },
            }}
            defaultValue={dayjs("2022-04-17")}
          />

          <FormControl margin="dense" variant="filled" fullWidth>
            <InputLabel id="sex">Sex</InputLabel>
            <Select
              required
              fullWidth
              autoComplete="sex"
              labelId="sex"
              value={"M"}
              onChange={() => {}}
            >
              <MenuItem value="M">Male</MenuItem>
              <MenuItem value="F">Female</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box
          sx={{
            width: "100%",
            marginBottom: 1,
          }}
        >
          <Typography variant="body1">Address</Typography>
          <TextField
            variant="filled"
            margin="dense"
            required
            fullWidth
            label="Address Line"
            name="line1"
            autoComplete="line1"
            autoFocus
          />
          <TextField
            variant="filled"
            margin="dense"
            required
            fullWidth
            label="City"
            name="city"
            autoComplete="city"
            autoFocus
          />
          <FormControl margin="dense" variant="filled" fullWidth>
            <InputLabel id="province">Province</InputLabel>
            <Select
              required
              fullWidth
              autoComplete="province"
              labelId="province"
              value={"Ontario"}
              onChange={() => {}}
            >
              <MenuItem value="ON">Ontario</MenuItem>
              <MenuItem value="QC">Quebec</MenuItem>
              <MenuItem value="NS">Nova Scotia</MenuItem>
              <MenuItem value="NB">New Brunswick</MenuItem>
              <MenuItem value="MB">Manitoba</MenuItem>
              <MenuItem value="BC">British Columbia</MenuItem>
              <MenuItem value="PE">Prince Edward Island</MenuItem>
              <MenuItem value="SK">Saskatchewan</MenuItem>
              <MenuItem value="AB">Alberta</MenuItem>
              <MenuItem value="NL">Newfoundland and Labrador</MenuItem>
            </Select>
          </FormControl>
          <TextField
            variant="filled"
            margin="dense"
            required
            fullWidth
            label="Country"
            name="country"
            autoComplete="country"
            autoFocus
          />
          <TextField
            variant="filled"
            margin="dense"
            required
            fullWidth
            label="Postal Code"
            name="postalCode"
            autoComplete="postalCode"
            autoFocus
          />
        </Box>
        <Button fullWidth variant="contained">
          book appointment
        </Button>
      </Box>
    </Container>
  );
}
