aws s3 sync ./build s3://wotaku-waiwai
aws cloudfront create-invalidation --distribution-id EIZH9SRHQ906I --paths "/*"
pause
