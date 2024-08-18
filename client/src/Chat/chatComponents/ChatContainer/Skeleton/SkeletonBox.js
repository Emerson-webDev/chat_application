import { Avatar, Grid, Skeleton, Typography } from "@mui/material";
import React from "react";
import {
  PaperRecieverSkeleton,
  PaperSenderSkeleton,
  RecieverCardContent,
  RecieverMessageBox,
  SenderCardContent,
  SenderMessageBox,
} from "../Theme/Theme";

export default function SkeletonBox() {
  return (
    <>
      <Grid item sx={{ paddingTop: "1rem" }}>
        <SenderMessageBox>
          <Grid container>
            <Grid item md={2} lg={2}></Grid>

            <Grid item xs={12} sm={12} md={10} lg={10}>
              <PaperSenderSkeleton elevation={2}>
                <Skeleton variant="rectangular" width="inherit" height={100}>
                  <SenderCardContent>
                    <Typography variant="body1">.</Typography>
                  </SenderCardContent>
                </Skeleton>
              </PaperSenderSkeleton>
            </Grid>
          </Grid>

          <Skeleton variant="circular" sx={{ display: "flex" }} height={40}>
            <Avatar />
          </Skeleton>
        </SenderMessageBox>
      </Grid>

      <Grid item sx={{ paddingTop: "1rem" }}>
        <RecieverMessageBox>
          <Skeleton variant="circular" sx={{ display: "flex" }} height={40}>
            <Avatar />
          </Skeleton>

          <Grid container>
            <Grid item xs={12} sm={12} md={10} lg={10}>
                <PaperRecieverSkeleton elevation={2}>
                  <Skeleton variant="rectangular" width="inherit" height={100}>
                    <RecieverCardContent>
                      <Typography variant="body1"></Typography>
                    </RecieverCardContent>
                  </Skeleton>
                </PaperRecieverSkeleton>
            </Grid>
            <Grid item md={2} lg={2}></Grid>
          </Grid>
        </RecieverMessageBox>
      </Grid>

      <Grid item sx={{ paddingTop: "1rem" }}>
        <SenderMessageBox>
          <Grid container>
            <Grid item md={2} lg={2}></Grid>

            <Grid item xs={12} sm={12} md={10} lg={10}>
              <PaperSenderSkeleton elevation={2}>
                <Skeleton variant="rectangular" width="inherit" height={100}>
                  <SenderCardContent>
                    <Typography variant="body1">.</Typography>
                  </SenderCardContent>
                </Skeleton>
              </PaperSenderSkeleton>
            </Grid>
          </Grid>

          <Skeleton variant="circular" sx={{ display: "flex" }} height={40}>
            <Avatar />
          </Skeleton>
        </SenderMessageBox>
      </Grid>

      <Grid item sx={{ paddingTop: "1rem" }}>
        <RecieverMessageBox>
          <Skeleton variant="circular" sx={{ display: "flex" }} height={40}>
            <Avatar />
          </Skeleton>

          <Grid container>
            <Grid item xs={12} sm={12} md={10} lg={10}>
                <PaperRecieverSkeleton elevation={2}>
                  <Skeleton variant="rectangular" width="inherit" height={100}>
                    <RecieverCardContent>
                      <Typography variant="body1"></Typography>
                    </RecieverCardContent>
                  </Skeleton>
                </PaperRecieverSkeleton>
            </Grid>
            <Grid item md={2} lg={2}></Grid>
          </Grid>
        </RecieverMessageBox>
      </Grid>
    </>
  );
}
