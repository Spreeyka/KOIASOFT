import AddIcon from "@mui/icons-material/Add";
import DoneIcon from "@mui/icons-material/Done";
import EditIcon from "@mui/icons-material/Edit";
import { Box, InputLabel, List, ListItem, ListItemText, Stack, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Comment, useStore } from "../../store";
import { CommentInput, IconButton, StyledBox } from "./styles";

const CommentSection = () => {
  const { dwellingType, fromQuarter, fromYear, toQuarter, toYear } = useParams();
  const [tempComment, setTempComment] = useState("Write comment");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempEditedComment, setTempEditedComment] = useState("");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { comments, commentAdded, commentTextEdited } = useStore((state) => state);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const path = `${dwellingType}-${fromYear}${fromQuarter}-${toYear}${toQuarter}`;
  const commentsForThisStat = comments.filter((comment) => comment.statUrl === path);

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const addComment = () => {
    if (!tempComment) return;
    commentAdded({
      id: uuidv4(),
      statUrl: path,
      text: tempComment,
    });
    setTempComment("");
  };

  const handleEditStart = (comment: Comment) => {
    setEditingId(comment.id);
    setTempEditedComment(comment.text);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, id: string) => {
    setTempEditedComment(e.target.value);
  };

  const handleEditConfirm = (e: React.MouseEvent) => {
    setEditingId(null);
    if (editingId) commentTextEdited(editingId, tempEditedComment);
  };

  useEffect(() => {
    if (editingId && inputRefs.current && Object.keys(inputRefs.current).length > 0) {
      const inputRef = inputRefs.current[editingId];
      if (inputRef) {
        inputRef.focus();
      }
    }
  }, [editingId]);

  const commentsMap = () => {
    return commentsForThisStat.map((comment: Comment, index) => (
      <ListItem
        disableGutters
        key={comment.id}
        onMouseEnter={() => handleMouseEnter(index)}
        onMouseLeave={handleMouseLeave}
        sx={{ padding: "8px 0 0" }}
      >
        <ListItemText>
          <Stack direction="row" alignItems="center" justifyContent="space-between" gap="20px">
            {editingId === comment.id ? (
              <CommentInput
                inputRef={(ref) => {
                  if (ref) {
                    inputRefs.current[comment.id] = ref;
                  }
                }}
                value={editingId === comment.id ? tempEditedComment : comment.text}
                onChange={(e) => handleEditChange(e, comment.id)}
                variant="standard"
                sx={{ height: "33px" }}
              />
            ) : (
              <Typography padding={"4px 0 5px 0"}>{comment.text}</Typography>
            )}
            {hoveredIndex === index && editingId !== comment.id && (
              <IconButton
                aria-label="edit comment"
                onClick={() => handleEditStart(comment)}
                backgroundColor="lightgray"
                hoverBackgroundColor="gray"
              >
                <EditIcon style={{ color: "white", fontSize: "16px" }} />
              </IconButton>
            )}
            {editingId === comment.id && (
              <IconButton
                aria-label="confirm editing"
                onClick={handleEditConfirm}
                backgroundColor="lightgreen"
                hoverBackgroundColor="#4CAF50"
              >
                <DoneIcon style={{ color: "white", fontSize: "16px" }} />
              </IconButton>
            )}
          </Stack>
        </ListItemText>
      </ListItem>
    ));
  };

  return (
    <Box style={{ padding: "0 0px 0 40px" }}>
      <InputLabel>Add comment:</InputLabel>
      <StyledBox sx={{ mt: 1 }}>
        <CommentInput
          id="comment"
          value={tempComment}
          onChange={(e) => setTempComment(e.target.value)}
          size="small"
          variant="standard"
        />
        <IconButton aria-label="add" onClick={addComment} backgroundColor="#00a4ff" hoverBackgroundColor="#007acc">
          <AddIcon style={{ color: "white", fontSize: "16px" }} />
        </IconButton>
      </StyledBox>
      <List sx={{ marginTop: "12px" }}>{commentsMap()}</List>
    </Box>
  );
};

export { CommentSection };
