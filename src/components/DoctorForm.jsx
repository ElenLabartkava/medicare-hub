import { useState } from "react";

export default function DoctorForm({ onAddDoctor, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    spec: "",
    experience: "",
    price: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = "სახელი სავალდებულოა";
    } else if (formData.name.trim().length < 3) {
      errs.name = "სახელი უნდა შედგებოდეს მინიმუმ 3 სიმბოლოსგან";
    }

    if (!formData.spec.trim()) {
      errs.spec = "სპეციალობის მითითება სავალდებულოა";
    }

    if (!formData.price.trim()) {
      errs.price = "ფასი სავალდებულოა";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newDoctor = {
      id: Date.now(),
      name: formData.name.trim(),
      spec: formData.spec.trim(),
      experience: formData.experience.trim() || "5 წლიანი გამოცდილება",
      price: `${formData.price.trim()} GEL`,
      avatar: "👨‍⚕️",
      nextSlot: "2026-10-20",
      formattedDate: "20 ოქტომბერი, 2026",
    };

    onAddDoctor(newDoctor);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          ექიმის სახელი და გვარი *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="მაგ: გიორგი ბერიძე"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 border-slate-300"
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          სპეციალობა *
        </label>
        <input
          type="text"
          value={formData.spec}
          onChange={(e) => setFormData({ ...formData, spec: e.target.value })}
          placeholder="მაგ: კარდიოლოგი"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 border-slate-300"
        />
        {errors.spec && (
          <p className="text-red-500 text-xs mt-1">{errors.spec}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            ვიზიტის ფასი (GEL) *
          </label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            placeholder="მაგ: 80"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 border-slate-300"
          />
          {errors.price && (
            <p className="text-red-500 text-xs mt-1">{errors.price}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            გამოცდილება
          </label>
          <input
            type="text"
            value={formData.experience}
            onChange={(e) =>
              setFormData({ ...formData, experience: e.target.value })
            }
            placeholder="მაგ: 10 წელი"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 border-slate-300"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t mt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm hover:bg-slate-50 transition"
        >
          გაუქმება
        </button>
        <button
          type="submit"
          className="px-5 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 transition"
        >
          დამატება
        </button>
      </div>
    </form>
  );
}
