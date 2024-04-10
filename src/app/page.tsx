import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import MediaCard from '@/components/MediaCard';
import EmailPopup from '@/components/EmailPopup';
import DisplayComponent from "@/components/CodeGrimoire";

export default function HomePage() {
    return (
        <Box sx={{ display: 'flex' }}>
            <div>
                {/*    This app uses the Next.js App Router and Material UI v5.*/}
                <Grid container rowSpacing={3} columnSpacing={3}>
                    <Grid xs={"auto"}>
                        <MediaCard
                            heading="resume"
                            text="pdf of my resume."
                            pdfUrl="/resume.pdf"
                        />
                        <EmailPopup />
                    </Grid>
                </Grid>
            </div>
            <div style = {{marginLeft:"10%"}}>
                <DisplayComponent/>
            </div>
        </Box>
    );
}