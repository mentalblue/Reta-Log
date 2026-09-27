# Reta Log 2.0.17 verification

Plan / Titration now intercepts Android Back while its wizard is open. From Preview, Schedule or Duration it moves exactly one step back and keeps the draft. From Dose it returns to Simple / Advanced plan selection; continuing with the selected plan resumes the same draft. The visible Back control uses the same behavior at every wizard step.

Browser regression checks cover system Back, in-app Back, preserving the draft through plan type selection, then completing the schedule and saving the plan. The regression suite is `tests/fixes217.cjs`.
