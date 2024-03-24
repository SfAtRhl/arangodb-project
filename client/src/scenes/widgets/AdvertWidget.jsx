import { Box, Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";

const AdvertWidget = () => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  return (
    <WidgetWrapper sx={{ padding: "0.5rem" }}>
      <FlexBetween sx={{ justifyContent: "flex-start" }}>
        <img
          width="50rem"
          height="50rem"
          alt="advert"
          src="../assets/adobe.png"
          style={{ borderRadius: "0.2rem" }}
        />
        <Box sx={{ pl: "0.5rem" }}>
          <Typography color={dark} variant="h6" fontWeight="500">
            Adobe
          </Typography>
          <Typography color={dark} variant="subtitle2" fontWeight="300">
            3,162,578 fallowers
          </Typography>
          <Typography color={dark} variant="subtitle2" fontWeight="300">
            Promoted
          </Typography>
        </Box>
      </FlexBetween>
      <Typography
        color={medium}
        variant="subtitle2"
        fontWeight="200"
        mt="0.5rem"
      >
        Unleash your creativity with Adobe: Explore limitless possibilities in
        design, photography, video editing, and more. Start your creative
        journey today!"
      </Typography>
      <img
        width="100%"
        height="auto"
        alt="advert"
        src="../assets/ads.jpg"
        style={{ borderRadius: "0.75rem", margin: "0.75rem 0 0.1rem 0" }}
      />
    </WidgetWrapper>
  );
};

export default AdvertWidget;
