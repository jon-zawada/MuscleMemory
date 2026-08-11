import { type JSX, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getExercises } from "../api/exerciseApi";
import { createExerciseLog, getExerciseLogs } from "../api/exerciseLogApi";
import { createSet, getSets, updateSet } from "../api/setsApi";
import { createWorkout, getWorkouts, updateWorkout } from "../api/workoutApi";
import type { Exercise } from "../types/exercise";
import type { ExerciseLog } from "../types/exerciseLog";
import type { WorkoutSet } from "../types/set";
import type { WorkoutStatus } from "../types/workout";

const ActiveWorkoutPage = (): JSX.Element => {
  const [activeWorkoutId, setActiveWorkoutId] = useState<string | null>(null);
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sets, setSets] = useState<WorkoutSet[]>([]);
  const [workoutStatus, setWorkoutStatus] = useState<WorkoutStatus>("in_progress");
  const [isFinishing, setIsFinishing] = useState(false);
  const [finishError, setFinishError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const init = async (): Promise<void> => {
      const workouts = await getWorkouts();
      const inProgress = workouts.find((w) => w.status === "in_progress");
      const workoutId = inProgress
        ? inProgress.id
        : await createWorkout({ status: "in_progress", name: "Test Workout" });
      const status = inProgress ? inProgress.status : "in_progress";
      setActiveWorkoutId(workoutId);
      setWorkoutStatus(status);

      const logs = await getExerciseLogs(workoutId);
      setExerciseLogs(logs);
    };
    init();
  }, []);

  useEffect(() => {
    const loadExercises = async (): Promise<void> => {
      setExercises(await getExercises());
    };
    loadExercises();
  }, []);

  const addExerciseLog = async (exercise: Exercise): Promise<void> => {
    if (!activeWorkoutId) return;
    const exerciseLogId = await createExerciseLog({
      workoutId: activeWorkoutId,
      exerciseId: exercise.id,
      orderIndex: exerciseLogs.length,
    });
    setExerciseLogs((prev) => [
      ...prev,
      {
        id: exerciseLogId,
        workoutId: activeWorkoutId,
        exerciseId: exercise.id,
        orderIndex: prev.length,
      },
    ]);
  };

  const currentLog = exerciseLogs[currentIndex] ?? null;
  useEffect(() => {
    if (!currentLog) return;
    const loadSets = async (): Promise<void> => {
      setSets(await getSets(currentLog.id));
    };
    loadSets();
  }, [currentLog]);

  const addSet = async (): Promise<void> => {
    if (!currentLog) return;
    const setId = await createSet({
      exerciseLogId: currentLog.id,
      setNumber: sets.length + 1,
      isWarmup: false,
    });
    setSets((prev) => [
      ...prev,
      { id: setId, exerciseLogId: currentLog.id, setNumber: prev.length + 1, isWarmup: false },
    ]);
  };

  const markSetComplete = async (set: WorkoutSet): Promise<void> => {
    const updated = await updateSet(set.id, {
      ...(set.weightKg != null && { weightKg: set.weightKg }),
      ...(set.reps != null && { reps: set.reps }),
      ...(set.rpe != null && { rpe: set.rpe }),
      completedAt: new Date().toISOString(),
    });
    setSets((prev) => prev.map((s) => (s.id === set.id ? updated : s)));
  };

  const updateLocalSet = (setId: string, patch: Partial<WorkoutSet>): void => {
    setSets((prev) => prev.map((s) => (s.id === setId ? { ...s, ...patch } : s)));
  };

  const finishWorkout = async (): Promise<void> => {
    if (!activeWorkoutId || workoutStatus !== "in_progress" || isFinishing) return;

    setIsFinishing(true);
    setFinishError(null);
    try {
      await updateWorkout(activeWorkoutId, {
        status: "completed",
        completedAt: new Date().toISOString(),
      });
      setWorkoutStatus("completed");
      navigate("/dashboard");
    } catch (error) {
      setFinishError("Couldn't finish workout. Try again.");
    } finally {
      setIsFinishing(false);
    }
  };

  const persistSet = async (set: WorkoutSet): Promise<void> => {
    await updateSet(set.id, {
      ...(set.weightKg != null && { weightKg: set.weightKg }),
      ...(set.reps != null && { reps: set.reps }),
      ...(set.rpe != null && { rpe: set.rpe }),
    });
  };

  return (
    <div>
      <h2>Pick an exercise</h2>
      <ul>
        {exercises.map((exercise) => (
          <li key={exercise.id}>
            {exercise.name}
            <button onClick={() => addExerciseLog(exercise)}>Add</button>
          </li>
        ))}
      </ul>

      <h2>Today's queue</h2>
      <ul>
        {exerciseLogs.map((log) => (
          <li key={log.id}>{log.exerciseId}</li>
        ))}
      </ul>
      {currentLog && (
        <div>
          <button disabled={currentIndex === 0} onClick={() => setCurrentIndex((i) => i - 1)}>
            Prev
          </button>
          <button
            disabled={currentIndex === exerciseLogs.length - 1}
            onClick={() => setCurrentIndex((i) => i + 1)}
          >
            Next
          </button>

          <table>
            <tbody>
              {sets.map((set) => (
                <tr key={set.id}>
                  <td>{set.setNumber}</td>
                  <td>{set.isWarmup ? "W" : ""}</td>
                  <td>
                    <input
                      type="number"
                      value={set.weightKg ?? ""}
                      disabled={!!set.completedAt}
                      onChange={(e) => updateLocalSet(set.id, { weightKg: Number(e.target.value) })}
                      onBlur={() => persistSet(set)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={set.reps ?? ""}
                      disabled={!!set.completedAt}
                      onChange={(e) => updateLocalSet(set.id, { reps: Number(e.target.value) })}
                      onBlur={() => persistSet(set)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={set.rpe ?? ""}
                      disabled={!!set.completedAt}
                      onChange={(e) => updateLocalSet(set.id, { rpe: Number(e.target.value) })}
                      onBlur={() => persistSet(set)}
                    />
                  </td>
                  <td>
                    <button disabled={!!set.completedAt} onClick={() => markSetComplete(set)}>
                      {set.completedAt ? "Done" : "Complete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={addSet}>+ Add Set</button>
        </div>
      )}
      <button onClick={finishWorkout} disabled={isFinishing || workoutStatus !== "in_progress"}>
        {isFinishing ? "Finishing..." : "Finish Workout"}
      </button>
      {finishError && <p role="alert">{finishError}</p>}
    </div>
  );
};

export default ActiveWorkoutPage;
