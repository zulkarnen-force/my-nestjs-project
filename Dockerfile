# =============================================
# Build Stage
# =============================================
FROM node:22-alpine AS builder

WORKDIR /app

# Use npm install instead of ci for better network tolerance
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# =============================================
# Production Stage - Minimal Image
# =============================================
FROM node:22-alpine AS production

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

WORKDIR /app

# Copy only production dependencies
# Use --omit=dev to skip devDependencies
COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force

# Copy built artifacts from builder
COPY --from=builder /app/dist ./dist

# Set ownership
RUN chown -R nestjs:nodejs /app

# Switch to nonroot user
USER nestjs

# Expose default NestJS port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000 || exit 1

# Start application
CMD ["node", "dist/main"]
