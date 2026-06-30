FROM nginx:alpine
# Copy the completely self-sufficient compiled frontend
COPY dist /usr/share/nginx/html

# Expose port 8080 (Cloud Run default)
EXPOSE 8080

# Configure Nginx to serve on port 8080 instead of 80
RUN sed -i 's/listen  *80;/listen 8080;/g' /etc/nginx/conf.d/default.conf

# To handle client-side routing if they ever refresh a sub-route (optional, but safe)
RUN sed -i '/index  index.html index.htm;/a \        error_page 404 /index.html;' /etc/nginx/conf.d/default.conf
