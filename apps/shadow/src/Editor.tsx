import { Box, Button, Chip, Paper, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

// Generated by https://quicktype.io

export interface ShadowRosterData {
  meta: Meta;
  statusCode: number;
  data: Data;
  error: null;
  executedIn: number;
}

export interface Data {
  clans: Clan[];
  players: Player[];
  group: Group;
}

export interface Clan {
  clan_id: number;
  name: string;
}

export interface Group {
  group_id: number;
  name: string;
  group_text_id: string;
}

export interface Player {
  user_id: number;
  username: string;
  clan_id: number | null;
  properties: Properties | null;
}

export interface Properties {
  targetLevels: string[];
  qrates: string;
  resellers: string;
  admin: boolean;
  qrew: boolean;
  notes: string;
}

export interface Meta {}

function Editor() {
  const { group, game_id } = useParams<{ group: string; game_id: string }>();
  const [data, setData] = useState<ShadowRosterData | null>(null);
  const [currentDroppableId, setCurrentDroppableId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    try {
      setIsLoggedIn(localStorage.getItem("CuppaZeeToken") !== null);
    } catch {}
  }, []);

  const loadData = async () => {
    const response = await fetch(`https://api.cuppazee.app/shadow/admin/${group}/${game_id}/roster`, {
      headers: {
        "x-cuppazee-token": localStorage.CuppaZeeToken,
      },
    });
    const json = await response.json();
    setData(json);
  };

  useEffect(() => {
    loadData();
  }, [isLoggedIn]);

  const clans = useMemo(() => {
    if (!data) return [];
    return [...data.data.clans]
      .sort((a, b) => ([a.name, b.name].sort()[0] === a.name ? -1 : 1))
      .map(i => ({
        ...i,
        name: i.name.replace(/^\<\d+\>/, ""),
      }));
  }, [data]);

  const navigate = useNavigate();

  if (data === null) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <Box
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}>
      <Box style={{ display: "flex", flexDirection: "row", padding: 4 }}>
        <Typography variant="h6" style={{ paddingRight: 8 }}>
          {data.data.group.name}
        </Typography>
        <Button
          variant="contained"
          size="small"
          onClick={() => {
            navigate(`/${group}/${game_id}/signup`);
          }}>
          Signup Form
        </Button>
        <div style={{ flex: 1 }} />
        {isLoggedIn ? (
          <Button
            variant="contained"
            size="small"
            onClick={() => {
              delete localStorage.CuppaZeeToken;
              setIsLoggedIn(false);
            }}>
            Logout
          </Button>
        ) : (
          <Button
            variant="contained"
            size="small"
            onClick={() => {
              location.href =
                "https://api.cuppazee.app/auth/login/main?state=" +
                encodeURIComponent(
                  JSON.stringify({
                    redirect: location.href,
                    platform: "web",
                    app: "shadow",
                    disableTeakens: true,
                  })
                );
            }}>
            Login
          </Button>
        )}
      </Box>
      <Box
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100vw",
          overflowX: "scroll",
          overflowY: "hidden",
          alignItems: "stretch",
        }}>
        <DragDropContext
          onDragUpdate={d => {
            if (d.destination?.droppableId !== currentDroppableId) {
              setCurrentDroppableId(d.destination?.droppableId ?? null);
            }
          }}
          onDragEnd={async d => {
            setCurrentDroppableId(null);
            if (d.destination?.droppableId !== d.source?.droppableId) {
              const player = data.data.players.find(i => i.user_id.toString() === d.draggableId)!;
              const originalPlayer = { ...player };
              if (!d.destination) return;
              if (d.destination?.droppableId === "-") {
                player.clan_id = null;
              } else {
                player.clan_id = Number(d.destination?.droppableId);
              }
              setData({ ...data });
              const response = await fetch(
                `https://api.cuppazee.app/shadow/admin/${group}/106/move`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "x-cuppazee-token": localStorage.CuppaZeeToken,
                  },
                  body: JSON.stringify({
                    user_id: player.user_id,
                    clan_id:
                      d.destination?.droppableId === "-"
                        ? null
                        : Number(d.destination?.droppableId),
                  }),
                }
              );
              if (response.status !== 200) {
                player.clan_id = originalPlayer.clan_id;
                setData({ ...data });
                alert("Failed to move player");
              }
            }
          }}>
          {(
            [
              ["-", "Uncategorised"],
              ...clans.map(c => [`${c.clan_id}`, `${c.name}`] as [string, string]),
            ] as [string, string][]
          ).map(c => (
            <Paper
              key={c[0]}
              elevation={currentDroppableId === c[0] ? 4 : 1}
              style={{
                margin: 4,
                minWidth: 130,
                flexGrow: 1,
                flexBasis: 0,
                display: "flex",
                flexDirection: "column",
              }}>
              <Typography
                style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {c[1]}
              </Typography>
              <Droppable droppableId={`${c[0]}`}>
                {(provided, snapshot) => (
                  <div
                    style={{
                      alignSelf: "stretch",
                      flex: 1,
                      overflowX: "hidden",
                      overflowY: "auto",
                    }}
                    ref={provided.innerRef}
                    {...provided.droppableProps}>
                    {data.data.players
                      .filter(i => {
                        if (c[0] === "-") {
                          return !i.clan_id;
                        } else {
                          return i.clan_id === Number(c[0]);
                        }
                      })
                      .map((i, n) => (
                        <Draggable key={i.user_id} index={n} draggableId={`${i.user_id}`}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{ ...provided.draggableProps.style }}>
                              <Paper
                                style={{ margin: 4, display: "flex", flexDirection: "column" }}
                                elevation={4}>
                                <Typography style={{ padding: 4, overflow: "hidden" }} variant="h6">
                                  {i.username}
                                </Typography>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    flexWrap: "wrap",
                                  }}>
                                  {i.properties?.targetLevels.map(l => (
                                    <Chip
                                      key={l}
                                      size="small"
                                      style={{ margin: 2, maxWidth: "100%", overflow: "hidden" }}
                                      label={`Level ${l}`}
                                    />
                                  ))}
                                  {i.properties?.admin ? (
                                    <Chip
                                      key="admin"
                                      size="small"
                                      color="secondary"
                                      style={{ margin: 2, maxWidth: "100%", overflow: "hidden" }}
                                      label={`Admin?`}
                                    />
                                  ) : null}
                                  {i.properties?.qrew ? (
                                    <Chip
                                      key="qrew"
                                      size="small"
                                      color="primary"
                                      style={{ margin: 2, maxWidth: "100%", overflow: "hidden" }}
                                      label={`QRew`}
                                    />
                                  ) : null}
                                  {i.properties?.qrates ? (
                                    <Chip
                                      key="qrates"
                                      size="small"
                                      color="info"
                                      style={{ margin: 2, maxWidth: "100%", overflow: "hidden" }}
                                      label={`QRates: ${i.properties?.qrates}`}
                                    />
                                  ) : null}
                                  {i.properties?.resellers ? (
                                    <Chip
                                      key="resellers"
                                      size="small"
                                      color="info"
                                      style={{ margin: 2, maxWidth: "100%", overflow: "hidden" }}
                                      label={`RUMs: ${i.properties?.resellers}`}
                                    />
                                  ) : null}
                                </div>
                                {i.properties?.notes ? (
                                  <Typography style={{ padding: 4 }} variant="caption">
                                    {i.properties?.notes}
                                  </Typography>
                                ) : null}
                              </Paper>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </Paper>
          ))}
        </DragDropContext>
      </Box>
    </Box>
  );
}

export default Editor;
