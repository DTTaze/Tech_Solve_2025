import * as React from "react";
import { emphasize, styled } from "@mui/material/styles";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Chip from "@mui/material/Chip";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const StyledBreadcrumb = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  height: theme.spacing(3),
  color: theme.palette.text.primary,
  fontWeight: theme.typography.fontWeightRegular,
  borderRadius: theme.shape.borderRadius,
  "&:hover, &:focus": {
    backgroundColor: emphasize(theme.palette.grey[100], 0.06),
    cursor: "pointer",
  },
  "&:active": {
    boxShadow: theme.shadows[1],
    backgroundColor: emphasize(theme.palette.grey[100], 0.12),
  },
}));

export default function CustomizedBreadcrumbs({
  section = "Dashboard",
  subsection = "",
}) {
  // Listen for navigation events and update breadcrumbs
  const [currentSection, setCurrentSection] = React.useState(section);
  const [currentSubsection, setCurrentSubsection] = React.useState(subsection);

  React.useEffect(() => {
    const handleNavigation = (event) => {
      if (event.detail) {
        if (event.detail.section) {
          setCurrentSection(
            event.detail.section.charAt(0).toUpperCase() +
              event.detail.section.slice(1)
          );
        }
        if (event.detail.subsection) {
          setCurrentSubsection(event.detail.subsection);
        } else {
          setCurrentSubsection("");
        }
      }
    };

    window.addEventListener("admin-navigation", handleNavigation);

    return () => {
      window.removeEventListener("admin-navigation", handleNavigation);
    };
  }, []);

  const handleClick = (event) => {
    event.preventDefault();
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        px: 2,
        py: 1,
        backgroundColor: "#f8f9fa",
        borderRadius: 1,
        boxShadow: 1,
        marginBottom: 2,
      }}
    >
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{
          "& .MuiBreadcrumbs-ol": {
            alignItems: "center",
          },
        }}
      >
        <StyledBreadcrumb
          component="a"
          href="/"
          label="Home"
          icon={<HomeIcon fontSize="small" />}
          onClick={handleClick}
        />
        <StyledBreadcrumb
          component="a"
          href="/admin"
          label="Admin"
          icon={<DashboardIcon fontSize="small" />}
          onClick={handleClick}
        />
        {currentSection && (
          <StyledBreadcrumb
            component="a"
            href={`/admin/${currentSection.toLowerCase()}`}
            label={currentSection}
            onClick={handleClick}
          />
        )}
        {currentSubsection && (
          <Typography variant="body2" color="text.primary" fontWeight={500}>
            {currentSubsection}
          </Typography>
        )}
      </Breadcrumbs>
    </Box>
  );
}
