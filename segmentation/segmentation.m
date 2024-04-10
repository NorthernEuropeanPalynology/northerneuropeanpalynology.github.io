# This code was adapted based on Ola Olsson et al. (2021), plase cite this webpage and the study mentioned before when
# adapting, copying or sharing the code.
# This code uses the Image Processing package "image" version 2.14.0


pkg load image;

function I1 = segment_pollen(filename)
  I = imread(filename); % Load image

  se = strel("disk", 10, 0); % Filter to use for dilation and eroding.
  IMG = rgb2gray(I); % Transform into grayscale
  IMG = edge(IMG, "Sobel", 0.02); % Use edge detection to amplify regions of interest
  IMG = imdilate(IMG, se); % Dilate these edges in order to circumvent the loss of weak edges.
  IMG = imfill(IMG, "holes"); % Fill the hole between edges to get areas of interest.
  IMG = imerode(IMG, se); % remove small artifacts that most likely are not pollen or NPP
  IMG = bwareafilt(IMG, [1500 1000000]); % The remaining areas should be between 1500 px. and 1000000 px. large. These value may need to be adapted based on the image size.
  #TODO: change the above limits based on percentages of the image.
  BW = IMG; % Use BW to create the binary mask.
  D = -bwdist(~IMG); % Create a distance matrix which calculates the distance of every pixel to the edge of an object.
  D = imhmin(D,10); % Remove shallow slopes that may exist.
  DL = watershed(D); % Use a watershed transform that creates different basins for pollen.
  labels = bwlabel(DL); % Use the watershed analysis to create individual labels of different objects.
  binary_mask = BW == 1; % Create a binary mask of where points are 1, based on the above image processing steps.
  labels(repmat(~binary_mask, [1,1])) = 0; %Overlay the labels with the mask such that black areas remain black.
  stats = regionprops(labels, "Centroid", "MajorAxisLength"); % Summarize the position and size of objects.

  % Iterate through each object
  for i = 1:size(stats, 1)
      x = stats(i).Centroid(1); % X coordinate of the center
      y = stats(i).Centroid(2); % Y coordinate of the center
      w = stats(i).MajorAxisLength;    % Width of the bounding box
      h = stats(i).MajorAxisLength;   % Height of the bounding box

      x1 = x - w/2;
      y1 = y - h/2;

      % Calculate the coordinates of the top-left corner of the bounding box
      % TODO: replicate code from python to adapt to corner or edge pollen.
      if x1 < 1
        x1 = 1;
      elseif y1 < 1
        y1 = 1;
      endif

      bbox = round([x1, y1, w, h]);

      I1 = I(y1:y1+h,x1:x1+w,:)
      #imshow(I(y1:y1+h,x1:x1+w,:));
      #imwrite(I(y1:y1+h,x1:x1+w,:), ["analysis" num2str(i) ".jpg"]);
  end

endfunction

segment_pollen("./sample_pollen.png");

