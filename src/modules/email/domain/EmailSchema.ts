import { z } from 'zod';

export const EmailSchema = z.object({
  email: z.string().email(),
  Template: z.enum(["Generic", "General"]),
  image_url: z.string().optional(),
  document_url: z.string().optional(),
  video_url: z.string().optional(),
  wsp_url: z.string().optional(),
  page_url: z.string().optional(),
  fb_url: z.string().optional(),
});
