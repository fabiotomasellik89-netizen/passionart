import { z } from "zod";
import { getShapeConfig } from "@/lib/configurator/shapes";
import type { ConfiguratorSelection, ShapeKey } from "@/types";
import { sanitizeText } from "@/lib/utils";

const shapeEnum = z.enum(["cuore", "stella", "rettangolo", "cerchio", "albero", "casetta"]);

export const configuratorSchema = z.object({
  productId: z.string().min(1),
  productSlug: z.string().min(1),
  shape: shapeEnum,
  width: z.number().positive(),
  height: z.number().positive(),
  thickness: z.number().positive(),
  quantity: z.number().int().min(1).max(500),
  engraving: z.string().max(60),
  addons: z.array(z.object({ groupId: z.string(), optionId: z.string() })),
});

export function validateConfiguratorSelection(input: ConfiguratorSelection) {
  const parsed = configuratorSchema.safeParse({
    ...input,
    engraving: sanitizeText(input.engraving),
  });

  if (!parsed.success) {
    return { valid: false, message: "Configurazione non valida." };
  }

  const shape = getShapeConfig(parsed.data.shape as ShapeKey);

  if (parsed.data.width < shape.minWidth || parsed.data.width > shape.maxWidth) {
    return {
      valid: false,
      message: `Larghezza consentita per ${shape.label.toLowerCase()}: ${shape.minWidth}-${shape.maxWidth} cm.`,
    };
  }

  if (parsed.data.height < shape.minHeight || parsed.data.height > shape.maxHeight) {
    return {
      valid: false,
      message: `Altezza consentita per ${shape.label.toLowerCase()}: ${shape.minHeight}-${shape.maxHeight} cm.`,
    };
  }

  if (parsed.data.thickness < shape.minThickness || parsed.data.thickness > shape.maxThickness) {
    return {
      valid: false,
      message: `Spessore consentito: ${shape.minThickness}-${shape.maxThickness} cm.`,
    };
  }

  if (parsed.data.engraving.length > shape.maxTextLength) {
    return {
      valid: false,
      message: `Il testo personalizzato può contenere al massimo ${shape.maxTextLength} caratteri.`,
    };
  }

  return { valid: true, message: "" };
}
