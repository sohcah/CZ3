import { Box, Button, Chip, Paper, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

// Generated by https://quicktype.io

export interface ShadowListData {
  meta: Meta;
  statusCode: number;
  data: Data;
  error: null;
  executedIn: number;
}

export interface Data {
  players: PlayerElement[];
  clans: Clan[];
  group: Group;
}

export interface Clan {
  clan_id: number;
  game_id: number;
  group_id: number;
  name: string;
}

export interface Group {
  group_id: number;
  name: string;
  group_text_id: string;
}

export interface PlayerElement {
  user_id: number;
  game_id: number;
  clan_id: number | null;
  group_id: number;
  player: PlayerPlayer;
  shadow_player_properties: ShadowPlayerProperty[];
}

export interface PlayerPlayer {
  username: string;
}

export interface ShadowPlayerProperty {
  user_id: number;
  group_id: number;
  properties: Properties;
  game_id: number;
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
  const [data, setData] = useState<ShadowListData | null>(null);
  const [currentDroppableId, setCurrentDroppableId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    try {
      setIsLoggedIn(localStorage.getItem("CuppaZeeToken") !== null);
    } catch {}
  }, []);

  const loadData = async () => {
    const response = await fetch(`https://api.cuppazee.app/shadow/admin/${group}/${game_id}/list`);
    const json = await response.json();
    setData(json);
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadData();
    }
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

  if (!isLoggedIn) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <Button disabled>Login</Button>
      </div>
    );
  }

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
              player.group_id = data.data.group.group_id;
            } else {
              player.clan_id = Number(d.destination?.droppableId);
              player.group_id = data.data.group.group_id;
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
                    d.destination?.droppableId === "-" ? null : Number(d.destination?.droppableId),
                }),
              }
            );
            if (response.status !== 200) {
              player.clan_id = originalPlayer.clan_id;
              player.group_id = originalPlayer.group_id;
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
                  style={{ alignSelf: "stretch", flex: 1, overflowX: "hidden", overflowY: "auto" }}
                  ref={provided.innerRef}
                  {...provided.droppableProps}>
                  {data.data.players
                    .filter(i => {
                      if (c[0] === "-") {
                        return i.group_id === data.data.group.group_id && !i.clan_id;
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
                                {i.player.username}
                              </Typography>
                              <div
                                style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
                                {i.shadow_player_properties[0]?.properties.targetLevels.map(l => (
                                  <Chip
                                    key={l}
                                    size="small"
                                    style={{ margin: 2, maxWidth: "100%", overflow: "hidden" }}
                                    label={`Level ${l}`}
                                  />
                                ))}
                                {i.shadow_player_properties[0]?.properties.admin ? (
                                  <Chip
                                    key="admin"
                                    size="small"
                                    color="secondary"
                                    style={{ margin: 2, maxWidth: "100%", overflow: "hidden" }}
                                    label={`Admin?`}
                                  />
                                ) : null}
                                {i.shadow_player_properties[0]?.properties.qrew ? (
                                  <Chip
                                    key="qrew"
                                    size="small"
                                    color="primary"
                                    style={{ margin: 2, maxWidth: "100%", overflow: "hidden" }}
                                    label={`QRew`}
                                  />
                                ) : null}
                                {i.shadow_player_properties[0]?.properties.qrates ? (
                                  <Chip
                                    key="qrates"
                                    size="small"
                                    color="info"
                                    style={{ margin: 2, maxWidth: "100%", overflow: "hidden" }}
                                    label={`QRates: ${i.shadow_player_properties[0]?.properties.qrates}`}
                                  />
                                ) : null}
                                {i.shadow_player_properties[0]?.properties.resellers ? (
                                  <Chip
                                    key="resellers"
                                    size="small"
                                    color="info"
                                    style={{ margin: 2, maxWidth: "100%", overflow: "hidden" }}
                                    label={`RUMs: ${i.shadow_player_properties[0]?.properties.resellers}`}
                                  />
                                ) : null}
                              </div>
                              {i.shadow_player_properties[0]?.properties.notes ? (
                                <Typography style={{ padding: 4 }} variant="caption">
                                  {i.shadow_player_properties[0]?.properties.notes}
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
  );
}

export default Editor;
