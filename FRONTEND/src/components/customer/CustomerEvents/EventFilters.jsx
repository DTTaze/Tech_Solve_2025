import React from "react";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";

const EventFilters = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "space-between",
        alignItems: { xs: "flex-start", md: "center" },
        mb: 3,
        gap: 2,
      }}
    >
      <TextField
        placeholder="Search events..."
        variant="outlined"
        size="small"
        fullWidth
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ maxWidth: { md: 300 } }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <Box sx={{ display: "flex", gap: 2 }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            label="Category"
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <MenuItem value="all">All Categories</MenuItem>
            <MenuItem value="environment">Environment</MenuItem>
            <MenuItem value="technology">Technology</MenuItem>
            <MenuItem value="education">Education</MenuItem>
            <MenuItem value="culture">Culture</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          size="small"
          sx={{
            borderColor: "var(--light-green)",
            color: "var(--primary-green)",
            "&:hover": {
              borderColor: "var(--primary-green)",
              backgroundColor: "rgba(46, 125, 50, 0.08)",
            },
          }}
        >
          Filters
        </Button>
      </Box>
    </Box>
  );
};

export default EventFilters;
