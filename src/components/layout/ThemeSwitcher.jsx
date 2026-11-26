import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiCheck, FiMonitor, FiMoon, FiSun } from "react-icons/fi";
import { PRIMARY_COLORS, THEME_MODES } from "../../constants/theme";
import { setPrimaryColor, setThemeMode } from "../../store/slices/themeSlice";
import Dropdown from "../common/Dropdown";
import IconButton from "../common/IconButton";

const modeIcons = { light: FiSun, dark: FiMoon, system: FiMonitor };

export default function ThemeSwitcher() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme);
  const [custom, setCustom] = useState(theme.primaryColor);

  useEffect(() => {
    setCustom(theme.primaryColor);
  }, [theme.primaryColor]);

  return (
    <Dropdown
      trigger={
        <IconButton title="Theme">
          <FiSun />
        </IconButton>
      }
    >
      <div className="w-64 p-2">
        <p className="px-2 pb-2 text-xs font-semibold uppercase text-muted">Appearance</p>
        <div className="grid grid-cols-3 gap-1">
          {THEME_MODES.map((mode) => {
            const Icon = modeIcons[mode.id];
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => dispatch(setThemeMode(mode.id))}
                className={`flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-xs ${
                  theme.mode === mode.id ? "bg-primary-soft text-primary" : "hover:bg-raised"
                }`}
              >
                <Icon />
                {mode.label}
              </button>
            );
          })}
        </div>
        <p className="px-2 pb-2 pt-3 text-xs font-semibold uppercase text-muted">Primary color</p>
        <div className="flex flex-wrap gap-2 px-2">
          {PRIMARY_COLORS.map((color) => (
            <button
              key={color.id}
              type="button"
              title={color.label}
              onClick={() => dispatch(setPrimaryColor(color.value))}
              className="flex h-7 w-7 items-center justify-center rounded-full"
              style={{ background: color.value }}
            >
              {theme.primaryColor === color.value ? <FiCheck className="text-white" /> : null}
            </button>
          ))}
          <label className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border border-border" title="Custom color">
            <input
              type="color"
              value={custom}
              onChange={(event) => {
                setCustom(event.target.value);
                dispatch(setPrimaryColor(event.target.value));
              }}
              className="h-10 w-10 cursor-pointer"
            />
          </label>
        </div>
      </div>
    </Dropdown>
  );
}
