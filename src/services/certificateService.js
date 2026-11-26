import { createResourceService } from "./createResource";
import { db } from "./mockStore";
import { copy, delay, nextId } from "../utils/helpers";

const base = createResourceService("certificates");

export const certificateService = {
  ...base,
  async issue(payload) {
    await delay();
    const item = {
      id: nextId(db.certificates),
      status: "issued",
      issuedAt: new Date().toISOString().slice(0, 10),
      certificateNumber: `${payload.prefix || "SKL"}-${Date.now()}`,
      ...payload,
    };
    db.certificates.push(item);
    return copy(item);
  },
  async verify(certificateNumber) {
    await delay();
    const found = db.certificates.find((item) => item.certificateNumber === certificateNumber);
    return found ? copy(found) : null;
  },
};
